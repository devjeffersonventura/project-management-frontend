# Gerenciador de Projetos

Este é um aplicativo frontend baseado em React para gerenciar projetos e tarefas. Permite que os usuários criem, editem e excluam projetos e tarefas, com uma interface amigável.

## Índice
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Uso](#uso)

## Pré-requisitos

Antes de começar, certifique-se de que você atendeu aos seguintes requisitos:
- Você tem o **Node.js** instalado (versão 14 ou superior).
- Você tem o **npm** (Node Package Manager) instalado.
- Você tem acesso à API backend (certifique-se de que está em execução).

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/devjeffersonventura/project-management-frontend.git
   cd project-management-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

1. **Variáveis de Ambiente**: Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
   ```env
   REACT_APP_API_URL=http://localhost:8000/v1
   ```

2. **Autenticação**: Certifique-se de que a API backend está em execução e acessível. O frontend se comunicará com ela para autenticação e gerenciamento de dados.

## Executando a Aplicação

Para iniciar a aplicação, execute o seguinte comando:
```bash
npm start
```

Isso iniciará o servidor de desenvolvimento e abrirá a aplicação no seu navegador padrão em `http://localhost:3000`.

## Uso

- **Login**: Use o formulário de login para autenticar. Se você não tiver uma conta, pode se registrar na página de registro.
- **Dashboard**: Após o login, você será redirecionado para o dashboard onde poderá visualizar todos os seus projetos.
- **Gerenciar Projetos**: Você pode criar, editar e excluir projetos. Clique em um projeto para ver seus detalhes e gerenciar tarefas.
- **Gerenciar Tarefas**: Dentro de cada projeto, você pode adicionar, editar e excluir tarefas.

