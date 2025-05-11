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

const questionDTO = z.object({
  question: z.string().min(1, "A pergunta não pode estar vazia."),
});

const caseTypeDTO = z.enum([
  "IDENTIFICAÇÃO",
  "AVALIAÇÃO DE LESÕES CORPORAIS",
  "COLETA DE PROVA",
  "PERÍCIA DE RESPONSABILIDADE",
  "EXAME DE VIOLÊNCIA",
  "ANÁLISE MULTIVÍTIMA",
  "OUTROS",
]);

const caseCreateDTO = z
  .object({
    nic: z.array(z.string()).min(1, "É necessário informar ao menos 1 NIC."),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    inquiryNumber: z.string(),
    caseType: caseTypeDTO,
    observations: z.string().optional(),
    location: locationDTO.optional(),
    professional: z.array(z.string()).optional(),
    requestingInstitution: z.string().min(1, "Instituição é obrigatória."),
    requestingAuthority: z.string().min(1, "Autoridade é obrigatória."),
    questions: z
      .array(questionDTO)
      .min(1, "É necessário informar pelo menos uma pergunta."),
  })
  .strict();

// base de resposta
const caseResponseDTO = z.object({
  id: z.any(),
  protocol: z.string(),
  patient: z.any(),
  title: z.string(),
  status: z.enum(["ABERTO", "FINALIZADO", "ARQUIVADO"]),
  openedAt: z.date(),
  closedAt: z
    .any()
    .optional()
    .transform((value) => (value === null ? undefined : value)),

  caseType: caseTypeDTO,
  evidence: z.array(z.any()).optional(),
});

const caseResponseDetailsDTO = z.object({
  ...caseResponseDTO.shape,
  caseReport: z.any(),
  inquiryNumber: z.string(),
  observations: z.string().optional(),
  location: locationDTO.optional(),
  openedBy: z.any(),
  professional: z.array(z.any()).optional(),
  requestingInstitution: z.string(),
  requestingAuthority: z.string(),
  questions: z.array(questionDTO),
});

const caseListDTO = z.array(
  caseResponseDTO.omit({
    requestingInstitution: true,
    requestingAuthority: true,
    questions: true,
    inquiryNumber: true,
    openedBy: true,
    observations: true,
    professional: true,
    location: true,
  })
);

const caseUpdateStatusDTO = z.object({
  status: z.enum(["ABERTO", "FINALIZADO", "ARQUIVADO"]),
  closedAt: z.string().optional(),
});

const caseUpdateDataDTO = z
  .object({
    title: z.string().optional(),
    inquiryNumber: z.string().optional(),
    caseType: caseTypeDTO.optional(),
    observations: z.string().optional(),
    location: locationDTO.optional(),
    professional: z.array(z.string()).optional(),
    requestingInstitution: z.string().optional(),
    requestingAuthority: z.string().optional(),
    questions: z.array(questionDTO).optional(),
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
