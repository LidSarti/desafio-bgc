const chromium = require("@sparticuz/chromium");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
import Responses from './api-responses';

import * as puppeteer from "puppeteer-core";

interface Product {
    name: string;
    price: string;
}

export const handler = async (): Promise<any> => {
    let browser: puppeteer.Browser | null = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto("https://www.mercadolivre.com.br/ofertas#nav-header");
        
        const productElements = await page.$$('.promotion-item');
        
        const productsPromises: Promise<Product>[] = productElements.slice(0, 3).map(async (product, index) => {
            const nameElement = await product.$('.promotion-item__title');
            const name = nameElement ? await nameElement.evaluate(element => element.textContent?.trim() || 'Title not found') : 'Title not found';

            const priceElement = await product.$('.promotion-item__price');
            let price = priceElement ? await priceElement.evaluate(element => element.textContent?.trim() || 'Price not found') : 'Price not found';

            const prices = price.split('R$');
            price = `R$${prices[1]}`;

            return { name, price };
        });

        const products = await Promise.all(productsPromises);

        await insertProductsIntoDynamoDB(products);

        return Responses._200({ message: `Made the inclusion of the following products in the database`, products });

    } catch (error) {
        return Responses._500({ message: `Failed to fetch products from Mercado Livre ${error}`});
    } finally {
        if(browser !== null) {
            await browser.close();
        }
    }
};

async function insertProductsIntoDynamoDB(products: Product[]): Promise<void> {
    const client = new DynamoDBClient({});
    const docClient = new DynamoDBDocumentClient(client);

    const batchSize = 25;
    const chunks = chunkArray(products, batchSize);

    for (const chunk of chunks) {
        try {
            const putRequests = chunk.map((product, index) => ({
                PutRequest: {
                    Item: {
                        id: index,
                        name: product.name ,
                        price: product.price,
                    }
                }
            }));

            await docClient.send(
                new BatchWriteCommand({
                    RequestItems: {
                        'ProdutosMercadoLivre': putRequests
                    }
                })
            );
        } catch (error) {
            console.error(`Error inserting batch of products: ${error}`);
        }
    }
}

function chunkArray<T>(array: T[], size: number): T[][] {
    const chunkedArray: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}
