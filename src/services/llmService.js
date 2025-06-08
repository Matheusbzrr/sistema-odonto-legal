const { ChatGroq } = require("@langchain/groq");
require("dotenv").config();

const getLLMResponseLaudo = async (evidenceData) => {
  const contextoFormatado = `
    Título: ${evidenceData.title}
    Condição da Evidência: ${evidenceData.condition}
    Categoria: ${evidenceData.category || "Não informada"}
    Descrição Técnica: ${evidenceData.descriptionTechnical}
    Testemunho: ${evidenceData.testimony || "Não informado"}
    Observações adicionais: ${evidenceData.obs || "Não informada"}`;

  const CONTEXTO =
    `Você é um assistente de PERITO ODONTOLÓGICO LEGAL. Sua função é gerar relatórios técnicos com base ` +
    `nas informações de evidências odontológicas no seguinte contexto:\n\n${contextoFormatado}` +
    `\n\nSe Categoria, Testemunho ou Observações adicionais vierem como "Não informada", apenas ignore esses campos.` +
    `\n\nSeja técnico e objetivo, evitando redundâncias. Não precisa de respostas longas, apenas diretas e com base nos dados passados.` +
    `\n\nNa sua resposta envie apenas sua conclusão, sem introdução e sem os dados do contexto na resposta ` +
    `\nResponda apenas em texto plano, sem emojis, formatação ou markdown.`;

  const model = new ChatGroq({
    model: "llama3-70b-8192",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.5,
    max_completion_tokens: 300,
  });

  const response = await model.invoke([
    { role: "system", content: CONTEXTO },
    {
      role: "user",
      content: "Elabore um relatório técnico baseado na evidência apresentada.",
    },
  ]);

  return response.content;
};

const getLLMResponseCase = async (caseData) => {
  const { title, caseType, observations, evidence = [] } = caseData;

  const blocoCaso = `
    DADOS DO CASO
    Título: ${title}
    Tipo: ${caseType}
    Observações gerais: ${observations || "Não informado"}`;

  const blocoEvidencias = evidence
    .map((ev, index) => {
      return `
      EVIDÊNCIA ${index + 1}
      Título: ${ev.title}
      Testemunho: ${ev.testimony || "Não informado"}
      Descrição técnica: ${ev.descriptionTechnical || "Não informada"}
      Observações: ${ev.obs || "Não informado"}`;
    })
    .join("\n");

  const contextoFormatado = `${blocoCaso}\n${blocoEvidencias}`;

  const CONTEXTO =
    `Você é um assistente de PERITO ODONTOLÓGICO LEGAL. Sua função é gerar relatórios técnicos com base ` +
    `nas informações passadas no seguinte contexto:\n\n${contextoFormatado}` +
    `\n\nSe Categoria, Testemunho ou Observações adicionais vierem como "Não informada", apenas ignore esses campos.` +
    `\n\nSeja técnico e objetivo, evitando redundâncias. Não precisa de respostas longas, apenas diretas e com base nos dados passados.` +
    `\n\nNa sua resposta envie apenas sua conclusão, sem introdução e sem os dados do contexto na resposta ` +
    `\nResponda apenas em texto plano, sem emojis, formatação ou markdown.`;

  const model = new ChatGroq({
    model: "llama3-70b-8192",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.5,
    max_completion_tokens: 300,
  });

  const response = await model.invoke([
    { role: "system", content: CONTEXTO },
    {
      role: "user",
      content:
        "Elabore um relatório técnico baseado nos dados apresentados. Responda apenas sua conclusao, sem introdução e sem os dados do contexto na resposta.",
    },
  ]);

  return response.content;
};

module.exports = {
  getLLMResponseLaudo,
  getLLMResponseCase,
};
