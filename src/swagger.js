const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dentalysis Odonto Legal API",
    version: "1.0.0",
    description: "Documentação automática da API da plataforma odontolegal.",
  },
  tags: [
    { name: "Usuários", description: "Gerenciamento de usuários" },
    { name: "Vitimas", description: "Gerenciamento de vitimas" },
    { name: "Casos", description: "Gerenciamento de casos" },
    { name: "Evidências", description: "Gerenciamento de evidências" },
    { name: "Laudos de Evidência", description: "Geração de laudos" },
    { name: "Relatórios de Casos", description: "Geração de relatórios" },
    { name: "Dashboard", description: "Dados estatísticos" },
  ],
  servers: [
    {
      url: "https://sistema-odonto-legal.onrender.com",
      description: "Servidor em produção",
    },
    {
      url: "http://localhost:8080",
      description: "Servidor local de desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      NovoCaso: {
        type: "object",
        properties: {
          protocol: { type: "string", example: "ABC123" },
          patient: {
            type: "array",
            items: { type: "string", example: "(adicione o NIC da(s) vítima(s))" },
          },
          title: { type: "string", example: "Identificação de vítimas" },
          caseType: {
            type: "string",
            enum: [
              "IDENTIFICAÇÃO",
              "AVALIAÇÃO DE LESÕES CORPORAIS",
              "COLETA DE PROVA",
              "PERÍCIA DE RESPONSABILIDADE",
              "EXAME DE VIOLÊNCIA",
              "ANÁLISE MULTIVÍTIMA",
              "OUTROS",
            ],
            example: "IDENTIFICAÇÃO",
          },
          inquiryNumber: { type: "string", example: "2024/001" },
          requestingInstitution: { type: "string", example: "Polícia Civil" },
          requestingAuthority: { type: "string", example: "Delegado Fulano" },
          observations: {
            type: "string",
            example: "Paciente com múltiplas fraturas",
          },
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  example: "Qual o estado da arcada dentária?",
                },
              },
            },
          },
          location: {
            type: "object",
            properties: {
              street: { type: "string", example: "Rua das Flores" },
              houseNumber: { type: "number", example: 123 },
              district: { type: "string", example: "Boa Vista" },
              city: { type: "string", example: "Recife" },
              state: { type: "string", example: "PE" },
              zipCode: { type: "string", example: "50000-000" },
              complement: { type: "string", example: "Bloco B, Apto 303" },
            },
          },

          professional: {
            type: "array",
            items: { type: "string", example: "67ef47cfcf7d324047b98076" },
          },
        },
        required: [
          "protocol",
          "patient",
          "title",
          "caseType",
          "requestingInstitution",
          "requestingAuthority",
          "questions",
          "openedBy",
        ],
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
