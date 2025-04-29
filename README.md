# Dentalysis – Odonto Legal 🦷

A plataforma **Dentalysis - Odonto Legal** tem como objetivo modernizar e centralizar a gestão de laudos periciais odontológicos, facilitando o registro, análise e identificação forense por meio de um sistema seguro, eficiente e acessível via Web.

Este repositório corresponde ao **backend** da aplicação, desenvolvido com foco em segurança, validação de dados, autenticação robusta e integração com o MongoDB.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript
- **Express** – Framework para APIs REST
- **MongoDB** – Banco de dados NoSQL
- **Mongoose** – ODM para MongoDB
- **Zod** – Validação de schemas
- **bcrypt** – Criptografia de senhas
- **JWT (JSON Web Token)** – Autenticação via token

---

## 🔐 Funcionalidades Principais da API

### 1️⃣ Autenticação e Gestão de Usuários

- Login seguro com geração de token JWT.
- Cadastro de usuários com papéis distintos: `Admin`, `Perito`, `Assistente`.
- Middleware para proteção de rotas baseado em permissões.

### 2️⃣ Gerenciamento de Casos Periciais

- Criar, listar, editar e arquivar casos odontolegais.
- Filtros de busca por status, datas e responsáveis.
- Vínculo de casos com usuários específicos.

### 3️⃣ Upload e Gestão de Evidências

- Upload de imagens odontológicas em base64 (ex: radiografias).
- Cadastro de evidências textuais com informações técnicas.
- Cada evidência é vinculada a um caso e categorizada.

### 4️⃣ Geração de Laudos Periciais

- Criação de laudos a partir das evidências.
- Exportação de laudos em formato PDF.
- Integração com ferramentas de visualização.

### 5️⃣ Banco de Dados Odonto-Legal

- Armazenamento de registros de vítimas identificadas ou não.
- Possibilidade de busca cruzada para auxiliar na identificação forense.

---


## Autores

- [Matheus Bezerra](https://www.linkedin.com/in/matheus-bzrr/)
- [Natália Bento](https://www.linkedin.com/in/natalia-bento-364b2b235/)

---
## ⚙️ Como Rodar o Projeto

- É necessario um arquivo .env na raiz do projeto apontando as seguintes variaveis:
  MONGO_URI=(LinkDoMongo)
  PORT=(SuaPorta)
  SECRET=(SuaChaveParaJwt)

```bash
git clone https://github.com/Matheusbzrr/sistema-odonto-legal.git
cd sistema-odonto-legal
npm install
npm run dev
````
