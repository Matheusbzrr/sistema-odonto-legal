const { z } = require("zod");

const locationDTO = z
  .object({
    street: z.string().optional(),
    houseNumber: z.number().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    complement: z.string().optional(),
  })
  .optional();

const caseCreateDTO = z
  .object({
    nic: z.any(),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    inquiryNumber: z.string().optional(),
    BO: z.string().optional(),
    caseType: z.enum([
      "ACIDENTE",
      "IDENTIFICAÇÃO DE VÍTIMA",
      "EXAME CRIMINAL",
      "MORDIDA",
      "AVALIAÇÃO DE LESÕES",
      "FRAUDE ODONTOLÓGICA",
      "DIREITOS HUMANOS",
    ]),
    observations: z.string().optional(),
    location: locationDTO.optional(),
    involved: z.array(z.string()).optional(), // Lista de IDs de usuários envolvidos
  })
  .strict();

//DTO para resposta de caso único
const caseResponseDTO = z.object({
  protocol: z.string(),
  patient: z.any(),
  title: z.string(),
  status: z.enum(["EM ABERTO", "FINALIZADO", "ARQUIVADO"]),
  openedAt: z.date(), // mudei para data pois no banco ta salvo como data direto
  closedAt: z
    .any()
    .optional()
    .transform((value) => (value === null ? undefined : value)),

  caseType: z.enum([
    "ACIDENTE",
    "IDENTIFICAÇÃO DE VÍTIMA",
    "EXAME CRIMINAL",
    "MORDIDA",
    "AVALIAÇÃO DE LESÕES",
    "FRAUDE ODONTOLÓGICA",
    "DIREITOS HUMANOS",
  ]),
  evidence: z.array(z.any()).optional(),
});

const caseResponseDetailsDTO = z.object({
  ...caseResponseDTO.shape,
  inquiryNumber: z.string().optional(),
  BO: z.string().optional(),
  observations: z.string().optional(),
  location: locationDTO.optional(),
  openedBy: z.any(),
  involved: z.array(z.any()).optional(),
});

const caseListDTO = z.array(
  caseResponseDTO.omit({
    BO: true,
    inquiryNumber: true,
    openedBy: true,
    observations: true,
    involved: true,
    location: true,
  })
);

const caseUpdateStatusDTO = z.object({
  status: z.enum(["EM ABERTO", "FINALIZADO", "ARQUIVADO"]),
  closedAt: z.string().optional(),
});

const caseUpdateDataDTO = z
  .object({
    title: z.string().optional(),
    inquiryNumber: z.string().optional(),
    BO: z.string().optional(),
    observations: z.string().optional(),
    location: locationDTO.optional(),
    caseType: z
      .enum([
        "ACIDENTE",
        "IDENTIFICAÇÃO DE VÍTIMA",
        "EXAME CRIMINAL",
        "MORDIDA",
        "AVALIAÇÃO DE LESÕES",
        "FRAUDE ODONTOLÓGICA",
        "DIREITOS HUMANOS",
      ])
      .optional(),
    involved: z.array(z.string()).optional(), // Lista de IDs de usuários envolvidos
    evidence: z.array(z.string()).optional(),
  })
  .strict();

module.exports = {
  caseCreateDTO,
  caseResponseDTO,
  caseResponseDetailsDTO,
  caseListDTO,
  caseUpdateStatusDTO,
  caseUpdateDataDTO,
};
