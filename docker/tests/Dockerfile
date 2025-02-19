FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src/ ./src/

# Comando para executar os testes
CMD ["npm", "test"] 