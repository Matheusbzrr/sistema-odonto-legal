const Case = require("../models/caseModel");

const generateReport = async (protocol) => {
  try {
    const caseData = await Case.findOne({ protocol })
      .populate("openedBy", "name role")
      .populate("involved", "name role")
      .populate({
        path: "evidence",
        populate: [
          { path: "collector", select: "name role" },
          { path: "whoVerified", select: "name role" },
        ],
      });

    if (!caseData) {
      throw new Error("Caso não encontrado.");
    }

    const safeValue = (value, defaultValue = "Não especificado") =>
      value ?? defaultValue;

    const formatLocation = (location) => {
      if (!location) return "Local não informado";
      return `${location.street}, ${location.houseNumber} - ${
        location.district
      }, ${location.city} - ${location.state}, CEP: ${location.zipCode} (${
        location.complement || "Sem complemento"
      })`;
    };

    const formattedDate = caseData.openedAt
      ? new Date(caseData.openedAt)
          .toISOString()
          .replace(/[-:T]/g, "_")
          .split(".")[0]
      : "data_indefinida";

    const protocolo = `${caseData.protocol}_${formattedDate}`;

    const report = {
      id: caseData._id,
      protocolo,
      cabecalho: {
        protocol: caseData.protocol,
        perito_responsavel: {
          nome: safeValue(caseData.openedBy?.name, "Desconhecido"),
          role: safeValue(caseData.openedBy?.role),
        },
        participantes: caseData.involved.map((user) => ({
          nome: user.name,
          role: user.role,
        })),
        local_do_crime: formatLocation(caseData.location),
        status_do_caso: caseData.status,
        data_de_abertura: caseData.openedAt,
        data_fechamento: caseData.closedAt || "Em andamento",
      },
      infos: {
        observacoes: caseData.observations,
        evidencias: caseData.evidence.map((ev) => ({
          condicao: safeValue(ev.condition),
          evidencia_verificada: !!ev.evidenceVerified,
          coletor: ev.collector
            ? { nome: ev.collector.name, role: ev.collector.role }
            : { nome: "Desconhecido", role: "Não especificado" },
          quem_verificou: ev.whoVerified
            ? { nome: ev.whoVerified.name, role: ev.whoVerified.role }
            : { nome: "Não verificado", role: "N/A" },
          obs: safeValue(ev.obs),
          tipo: safeValue(ev.category),
          fotos: safeValue(ev.photo, "Sem foto"),
        })),
      },
      data_de_emissao: new Date(),
    };

    return report;
  } catch (error) {
    console.error("Erro ao gerar o laudo:", error);
    throw new Error("Falha ao gerar o laudo.");
  }
};

module.exports = { generateReport };
