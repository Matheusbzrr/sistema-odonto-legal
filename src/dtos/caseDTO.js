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
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    status: z.enum(["EM ABERTO", "FINALIZADO", "ARQUIVADO"]),
    inquiryNumber: z.string().optional(),
    BO: z.string().optional(),
    caseType: z
      .string()
      .min(3, "O tipo do caso deve ter pelo menos 3 caracteres"),
    observations: z.string().optional(),
    location: locationDTO.optional(),
    involved: z.array(z.string()).optional(), // Lista de IDs de usuários envolvidos
    evidence: z.array(z.string()).optional(),
  })
  .strict();

//DTO para resposta de caso único
const caseResponseDTO = z.object({
  protocol: z.string(),
  title: z.string(),
  status: z.enum(["EM ABERTO", "FINALIZADO", "ARQUIVADO"]),
  openedAt: z.date(), // mudei para data pois no banco ta salvo como data direto
  closedAt: z
    .any()
    .optional()
    .transform((value) => (value === null ? undefined : value)),
  inquiryNumber: z.string().optional(),
  BO: z.string().optional(),
  caseType: z.string(),
  observations: z.string().optional(),
  location: locationDTO.optional(),
  openedBy: z.any(),
  involved: z.array(z.any()).optional(),
  evidence: z.array(z.any()).optional(),
  
});

//DTO para resposta de lista de casos

const caseListDTO = z.array(caseResponseDTO);

// DTO para atualização de status de caso

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
    involved: z.array(z.string()).optional(), // Lista de IDs de usuários envolvidos
    evidence: z.array(z.string()).optional(),
  })
  .strict();

module.exports = {
  caseCreateDTO,
  caseResponseDTO,
  caseListDTO,
  caseUpdateStatusDTO,
  caseUpdateDataDTO,
};
