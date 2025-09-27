# ClassiPy - Frontend

Este é o repositório do frontend da aplicação **ClassiPy**, um projeto desenvolvido pela equipe Bug Busters para o 4º semestre de Análise e Desenvolvimento de Sistemas.

O ClassiPy é um Agente de Inteligência Artificial projetado para instruir e automatizar o Processo de Registro de Importação. A aplicação web tem como objetivo otimizar a elaboração de registros aduaneiros, um processo tradicionalmente manual e suscetível a erros que podem acarretar multas e penalidades.

Este frontend, desenvolvido com **React**, **TypeScript** e **Vite**, fornece a interface de usuário para todo o fluxo de trabalho. Através dele, o operador pode:

-   Realizar o upload de documentos PDF, como Pedidos de Compra.
-   Visualizar a lista de Part Numbers extraídos pela IA.
-   Revisar, editar e validar as classificações fiscais detalhadas (NCM, descrição, fabricante, etc.) sugeridas para cada produto.

O objetivo é oferecer uma experiência de usuário limpa e eficiente, transformando um processo complexo em um fluxo de trabalho digital, rápido e inteligente.

---

# Como Contribuir - Seu Passaporte de Entrada

Estamos felizes em receber você aqui e saber que está interessado em contribuir para o nosso projeto. Como um projeto de código aberto, cada contribuição é valorizada e ajuda a impulsionar o crescimento e a qualidade do nosso trabalho. Este guia foi criado para orientá-lo sobre como você pode participar e fazer parte da nossa comunidade de desenvolvimento. Estamos ansiosos para ver suas contribuições e trabalhar juntos para tornar nosso projeto ainda melhor!

## Código de Conduta

Para garantir um ambiente respeitável e inclusivo, leia e siga nosso [Código de Conduta](./CODE_OF_CONDUCT.md).

## Começando a Contribuir

Contribuir para o nosso projeto é fácil e estamos ansiosos para receber suas contribuições! Antes de entrarmos nos passos para instalação da aplicação, você precisará configurar algumas ferramentas e preparar seu ambiente de desenvolvimento.

Aqui está o que você precisa:

-   Uma conta no [GitHub](https://github.com/)
-   O *version control system* [Git](https://git-scm.com/) instalado.
-   Um IDE para o desenvolvimento. Recomendamos o [Visual Studio Code](https://code.visualstudio.com).
-   O [Node.js v20.x](https://nodejs.org/en) ou superior.
-   O backend do ClassiPy precisa estar rodando para que o frontend possa se comunicar com a API. Siga as instruções de instalação do [repositório do backend](https://github.com/Bug-Busters-F/ClassiPy-backend).

## Instalação

### 1. Clonar o Repositório

O primeiro passo é clonar o repositório do projeto para o seu ambiente local.

1.  Abra um terminal.

2.  Execute o seguinte comando para clonar o repositório:
    ```bash
    git clone https://github.com/Bug-Busters-F/ClassiPy-frontend
    ```

3.  Navegue até o diretório do projeto:
    ```bash
    cd ClassiPy-frontend
    ```

### 2. Instalar Dependências e Rodar o Projeto

Com o ambiente configurado, basta instalar as dependências do Node.js e iniciar o servidor de desenvolvimento.

1.  Instale as dependências do projeto:
    ```sh
    npm install
    ```

2.  Execute a aplicação em modo de desenvolvimento:
    ```sh
    npm run dev
    ```

### 3. Acesse a Aplicação

-   A aplicação frontend estará disponível em: [http://localhost:5173](http://localhost:5173) .
-   Certifique-se de que o backend também esteja rodando em `http://localhost:8000` para que a comunicação funcione.