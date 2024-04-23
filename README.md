# 👩‍💻 Projeto de Scraping e Função Lambda com Serverless Framework

Este é um projeto que visa realizar scraping de dados de um site e disponibilizá-los por meio de uma API usando o AWS Lambda e o Serverless Framework. A função Lambda é escrita em TypeScript e hospedada na infraestrutura serverless da AWS.

## 📝 Funcionalidades Principais

- Realiza scraping de dados de um site específico para obter informações sobre produtos.
- Exponha os dados coletados por meio de uma API RESTful hospedada no AWS Lambda.
- Armazena os dados coletados em uma tabela do Amazon DynamoDB para persistência.

## 💻 Tecnologias Utilizadas

- Serverless Framework;
- AWS Lambda;
- TypeScript;
- Puppeteer;
- AWS DynamoDB.

## ⚙️ Configuração do Projeto

1. Certifique-se de ter o Node.js e o npm instalados em seu sistema.
2. Clone este repositório em sua máquina local.
3. Instale as dependências do projeto executando _npm install_.
4. Configure suas credenciais da AWS localmente para implantar o aplicativo no AWS Lambda.