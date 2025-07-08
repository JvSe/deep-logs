# Projeto Next.js

Este é um projeto desenvolvido com [Next.js](https://nextjs.org), um framework React para produção.

## Sobre o Projeto

Este projeto foi criado para demonstrar as capacidades do Next.js e pode ser usado como ponto de partida para aplicações web modernas.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org) - Framework React
- [React](https://reactjs.org) - Biblioteca JavaScript para interfaces
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript tipado
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utilitário

## Como Executar

### Pré-requisitos

Certifique-se de ter o Node.js instalado em sua máquina.

### Instalação

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITORIO]
cd [NOME_DO_PROJETO]
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

A página atualiza automaticamente conforme você edita os arquivos.

## Estrutura do Projeto

```
├── app/                 # Diretório principal da aplicação (App Router)
│   ├── page.tsx        # Página inicial
│   └── layout.tsx      # Layout principal
├── components/         # Componentes reutilizáveis
├── public/            # Arquivos estáticos
└── styles/            # Arquivos de estilo
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## Deploy

A forma mais fácil de fazer deploy da sua aplicação Next.js é usar a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está sob a licença MIT.
