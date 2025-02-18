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

## 🔒 Autenticação

O frontend utiliza JWT para autenticação com a API. O token é armazenado no localStorage e enviado no header Authorization de todas as requisições.

## 🎨 Estilização

- Material-UI para componentes base
- Styled-components para customizações
- Tema personalizado para consistência visual

