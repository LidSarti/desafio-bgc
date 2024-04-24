# 👩‍💻 Projeto de Scraping e Função Lambda com Serverless Framework

Este é um projeto que visa realizar scraping de dados de um site e disponibilizá-los por meio de uma API usando o AWS Lambda e o Serverless Framework. A função Lambda é escrita em TypeScript e hospedada na infraestrutura serverless da AWS.

## 📝 Funcionalidades Principais

- Realiza scraping de dados de um site específico para obter informações sobre produtos.
- Exponha os dados coletados por meio de uma API RESTful hospedada no AWS Lambda.
- Armazena os dados coletados em uma tabela do Amazon DynamoDB para persistência.

## 🚀 Documentação API
Foi desenvolvido uma rota utilizando o aws api gateway 

### Método GET - rota "/"
*Descrição:* Esta rota retorna os detalhes dos produtos coletados através do scraping do site específico.

Possíveis retornos:
*Código 200 (OK)*
Este código é retornado quando a solicitação é processada com sucesso. O corpo da resposta inclui os detalhes dos produtos encontrados, incluindo seus nomes, preços e links para visualização.

Exemplo de corpo da resposta:
````
{
    "message": "Inclusão dos seguintes produtos no banco de dados",
    "products": [
        {
            "nome": "Produto 1",
            "preco": 99.99
        },
        {
            "nome": "Produto 2",
            "preco": 149.99
        },
        {
            "nome": "Produto 3",
            "preco": 79.99
        }
    ]
}
````

*Código 500*
Este código é retornado quando ocorre algum erro durante o processamento da solicitação. O corpo da resposta inclui detalhes sobre o erro ocorrido.

Exemplo de corpo da resposta:

````
"message": "Failed to fetch products from Mercado Livre Detalhes do erro específico"
````

## 💻 Tecnologias Utilizadas

- Serverless Framework;
- AWS Lambda;
- TypeScript;
- Puppeteer;
- AWS DynamoDB.

## ⚙️ Configuração do Projeto

1. Certifique-se de ter o Node.js e o npm instalados em seu sistema;
2. Clone este repositório em sua máquina local;
3. Instale as dependências do projeto executando _npm install_;
4. Configure suas credenciais da AWS localmente para implantar o aplicativo no AWS Lambda.