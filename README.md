# Gerenciamento de Projetos Frontend

Interface web para gerenciamento de projetos e tarefas desenvolvida com React.

## 🚀 Tecnologias

- React 18
- TypeScript
- Docker
- Material-UI
- React Router
- Context API
- Axios

## 📋 Pré-requisitos

- Docker Desktop
- Git
- API Backend em execução

## ⚙️ Instalação com Docker

1. Clone o repositório
```bash
git clone https://github.com/devjeffersonventura/project-management-frontend
cd project-management-frontend
```

2. Configure o ambiente
```bash
# Copie o arquivo de ambiente
cp .env.example .env
```

3. Construa e inicie os containers
```bash
# Construir os containers
docker-compose build --no-cache

# Iniciar os containers em background
docker-compose up -d
```

## 🐳 Arquivos de Configuração Docker

### docker-compose.yml
```yaml
services:
  frontend:
    build:
      # ATENÇÃO: Altere este caminho para o local do seu projeto
      context: /caminho/completo/para/seu/projeto
      dockerfile: docker/frontend/Dockerfile
    container_name: project_management_frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      # ATENÇÃO: Altere este caminho para o local do seu projeto
      - /caminho/completo/para/seu/projeto:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:8000

networks:
  default:
    name: app_network
```

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Ajustando os Caminhos

1. **Windows**
```yaml
context: C:/Users/seu-usuario/projetos/project-management-frontend
volumes:
  - C:/Users/seu-usuario/projetos/project-management-frontend:/app
```

2. **Linux/Mac**
```yaml
context: /home/seu-usuario/projetos/project-management-frontend
volumes:
  - /home/seu-usuario/projetos/project-management-frontend:/app
```

### ⚠️ Observações Importantes
- Use barras normais (/) em vez de barras invertidas (\) no Windows
- Certifique-se de que os caminhos existem no seu computador
- Se houver espaços no caminho, use aspas
- Não use caminhos relativos, sempre use caminhos completos

## 📦 Dependências

```bash
# Instalar dependências
docker-compose exec frontend npm install
```

## 🔧 Serviços Disponíveis

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8000

## 📦 Comandos Docker Úteis

### Gerenciamento de Containers
```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir container após mudanças
docker-compose up -d --build
```

## 🔍 Troubleshooting

### Problemas com Node Modules
```bash
# Limpar cache do npm
docker-compose exec frontend npm cache clean --force

# Reinstalar dependências
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
```

### Problemas com Build
```bash
# Limpar cache do build
docker-compose exec frontend npm run build:clean
```

## 🧹 Limpeza

Para remover todos os containers e volumes:
```bash
# Parar e remover containers
docker-compose down

# Remover volumes
docker-compose down -v

# Remover containers/imagens não utilizados
docker system prune -a
```

## 📝 Variáveis de Ambiente

Principais variáveis necessárias no `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/v1
REACT_APP_ENV=development
```

## 📚 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── services/         # Serviços e integrações
├── context/          # Contextos React
├── hooks/            # Hooks personalizados
├── types/            # Definições de tipos
└── utils/            # Funções utilitárias
```
## 🧪 Testes

Este projeto inclui testes automatizados para os componentes principais. Os testes podem ser executados de duas maneiras:

### Localmente

Para executar os testes em sua máquina local:
Executar todos os testes
```bash
npm test
```
Executar testes em modo watch
```bash
npm test -- --watch
```

Executar testes com cobertura
```bash
npm test -- --coverage
```


### Com Docker

Para executar os testes em um ambiente Docker isolado:
Construir e executar os testes
```bash
docker-compose run --rm frontend-tests
```

Executar testes em modo watch
```bash
docker-compose run --rm frontend-tests npm test -- --watchAll
```

### Estrutura dos Testes

Os testes estão organizados na pasta `src/components/__tests__/` e incluem:

- `LoginForm.test.tsx`: Testes do formulário de login
  - Validação de credenciais
  - Integração com API
  - Redirecionamento após login

- `RegisterForm.test.tsx`: Testes do formulário de registro
  - Validação de campos
  - Integração com API
  - Validação de senhas
  - Redirecionamento após registro

### Cobertura de Testes

Os testes cobrem os principais fluxos da aplicação:
- Autenticação de usuários
- Registro de novos usuários
- Validação de formulários
- Integração com API
- Navegação entre páginas

## Tecnologias de Teste

- Jest
- React Testing Library
- Docker para ambiente isolado de testes
## 🔒 Autenticação

O frontend utiliza JWT para autenticação com a API. O token é armazenado no localStorage e enviado no header Authorization de todas as requisições.

## 🎨 Estilização

- Material-UI para componentes base
- Styled-components para customizações
- Tema personalizado para consistência visual

