const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

module.exports.handler = async () => {
    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto("https://www.mercadolivre.com.br/ofertas#nav-header");
        
        const productElements = await page.$$('.promotion-item');
        const products = [];

        await Promise.all(productElements.map(async (product) => {
            const nameElement = await product.$('.promotion-item__title');
            const name = nameElement ? await nameElement.evaluate(element => element.textContent.trim()) : 'Title not found';

            const priceElement = await product.$('.promotion-item__price');
            let price = priceElement ? await priceElement.evaluate(element => element.textContent.trim()) : 'Price not found';

            const prices = price.split('R$');
            price = `R$${prices[1]}`;

            products.push({ name, price });
        }));

        await browser.close();

        const client = new DynamoDBClient({});
        const docClient = new DynamoDBDocumentClient(client);
        
        if (products && products.length > 0) {
            await Promise.all(products.map(async (product, index) => {
                try {
                    await docClient.send(
                        new PutCommand({
                          TableName: 'ProdutosMercadoLivre',
                          Item: {
                            id: index,
                            name: product.name,
                            price: product.price,
                          },
                        })
                      );
                } catch (error) {
                    return {
                        statusCode: 500,
                        message: `Error inserting product ${index}: ${error}`
                    };
                }
            }));
        } else {
            console.error('No elements found.');
            return {
                statusCode: 500,
                message: 'No elements found.'
            };
        }
        
        return {
            statusCode: 200,
            message: 'Products insertion successful.'
        };

    } catch (error) {
        return {
            statusCode: 500,
            message: `Failed to fetch products from Mercado Livre ${error}`
        };
    }
};
