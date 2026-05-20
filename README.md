   <h1> Cloud Storage API ☁️ </h1>

Este projeto é uma API REST robusta desenvolvida em **NestJS** voltada para o gerenciamento, upload e exclusão de arquivos em um ambiente de nuvem simulado localmente. 

A aplicação foi aprimorada com regras rigorosas de validação de dados de entrada, garantindo o controle total sobre o tamanho e o formato dos arquivos aceitos, além de contar com um fluxo estruturado de tratamento de exceções com retornos HTTP específicos.

---

<h1> 🚀 Guia de Instalação e Execução </h1>

Siga o passo a passo abaixo para clonar o repositório, instalar as dependências necessárias e colocar o servidor para rodar localmente na sua máquina.

### 1. Clonando o Repositório
Abra o seu terminal (Git Bash, Terminal do VS Code ou Prompt de Comando) e execute o comando abaixo para baixar o código:
```bash
git clone [https://github.com/julia-lw/upload](https://github.com/julia-lw/upload)
```

### 2. Acessando a Pasta do Projeto
Navegue até o diretório criado após a clonagem:

Bash
cd nome-do-repositorio
3. Instalando as Dependências
Para baixar todos os pacotes e ecossistemas necessários (como o próprio NestJS e os gerenciadores de arquivos), execute o comando do gerenciador de pacotes:

Bash
npm install
4. Executando a API
Inicie o servidor em ambiente de desenvolvimento. O modo watch reiniciará a aplicação automaticamente a cada alteração salva:

Bash
npm run start:dev
O console exibirá os logs de inicialização do NestJS. A API estará pronta e escutando na porta padrão: http://localhost:3000

🧭 Como Navegar pelo Código
Para facilitar a leitura e o entendimento da arquitetura do projeto por outros desenvolvedores, a estrutura principal de arquivos dentro da pasta src/arquivo/ está dividida seguindo os padrões do framework:

arquivo.controller.ts (Controlador de Rotas): É a porta de entrada da API. Aqui estão mapeados todos os endpoints públicos (URLs e métodos HTTP). Ele intercepta as requisições, faz o bind dos parâmetros e delega a execução para a camada de serviços.

arquivo.service.ts (Regras de Negócio): Onde toda a lógica pesada acontece. Contém o construtor que inicializa e verifica a existência da pasta ./drive, os validadores de bytes e tipos de mídia (MimeTypes), e a manipulação direta do sistema de arquivos (fs) para salvar ou apagar do disco.

🛠️ Guia Completo de Endpoints e Uso da Ferramenta
Todas as rotas da API começam pelo prefixo base /arquivos. Você pode testar os endpoints utilizando clientes HTTP como Postman, Insomnia ou a extensão Thunder Client diretamente no VS Code.

1. Adicionar um Arquivo (Upload de Imagem)
Responsável por receber uma imagem e salvá-la de forma segura no diretório local do servidor.

Método HTTP: POST

Rota Completa: http://localhost:3000/arquivos/upload

Tipo do Corpo da Requisição (Body): form-data

Chave do Parâmetro (Key): file (Defina o tipo como "File" na ferramenta de testes e selecione a imagem desejada).

🛡️ Regras e Filtros Aplicados:
Limite de Tamanho: Rejeição automática se o arquivo for maior que 5MB.

Formatos Permitidos: Aceita exclusivamente extensões de imagem populares: JPG, JPEG, PNG e TIFF.

🟢 Resposta de Sucesso (Status 201 Created)
JSON
{
  "message": "Arquivo enviado com sucesso!",
  "filename": "imagem-171623456789.png",
  "originalname": "meu-screenshot.png",
  "size": 1048576
}
🔴 Respostas de Erro de Validação:
Caso o tamanho exceda 5MB (Status 413 Payload Too Large):

JSON
{
  "erro": "Arquivo muito grande",
  "mensagem": "O tamanho máximo permitido é de 5MB."
}
Caso o formato não seja suportado - ex: PDF ou ZIP (Status 400 Bad Request):

JSON
{
  "erro": "Formato inválido",
  "mensagem": "Apenas imagens nos formatos JPG, JPEG, PNG e TIFF são aceitas."
}
2. Listar Arquivos Armazenados
Exibe a relação completa e metadados de tudo o que está guardado no seu repositório de nuvem local.

Método HTTP: GET

Rota Completa: http://localhost:3000/arquivos

Parâmetros: Nenhum.

🟢 Resposta de Sucesso (Status 200 OK)
JSON
{
  "total": 1,
  "files": [
    {
      "filename": "imagem-171623456789.png",
      "size": 1048576,
      "criado": "2026-05-20T19:20:00.000Z"
    }
  ]
}
3. Deletar um Arquivo por Nome
Busca um arquivo específico no drive pelo nome completo gerado pelo sistema e o remove de forma definitiva.

Método HTTP: DELETE

Rota Completa: http://localhost:3000/arquivos/:filename

Parâmetro de URL: Substitua o trecho :filename pelo nome exato do arquivo desejado com a extensão (Exemplo: http://localhost:3000/arquivos/imagem-171623456789.png).

🟢 Resposta de Sucesso (Status 200 OK)
JSON
{
  "sucesso": true,
  "mensagem": "O arquivo imagem-171623456789.png foi removido com sucesso."
}
🔴 Resposta de Erro (Status 404 Not Found)
Caso o nome enviado não corresponda a nenhum arquivo físico no diretório:

JSON
{
  "erro": "Não encontrado",
  "mensagem": "Nenhum arquivo com o nome \"arquivo-inexistente.png\" foi localizado."
}
🛠️ Tecnologias Utilizadas
NestJS - Framework Node.js progressivo para a criação de aplicativos eficientes e escaláveis.

TypeScript - Superset Javascript que adiciona tipagem estática opcional ao código.

Multer - Middleware node.js para manipulação de multipart/form-data utilizado para upload.