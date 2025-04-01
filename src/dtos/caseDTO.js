const { z } = require("zod");

const caseCreateDTO = z
  .object({
    nic: z.string().min(2, "O nic é obrigatório."),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    status: z.enum(["EM ABERTO", "FINALIZADO"]),
    inquiryNumber: z.string().min(1, "O número do inquérito é obrigatório"),
    caseType: z
      .string()
      .min(3, "O tipo do caso deve ter pelo menos 3 caracteres"),
    observations: z.string().optional(),
    location: z
      .object({
        latitude: z.string(),
        longitude: z.string(),
      })
      .optional(), // passando estrutura competa como opcional, isso força ao usuario passar a: ou passa os dois ou n passa nada
  })
  .strict();

//DTO para resposta de caso único
const caseResponseDTO = z.object({
  nic: z.string(),
  title: z.string(),
  status: z.enum(["EM ABERTO", "FINALIZADO"]),
  openedAt: z.date(), // mudei para data pois no banco ta salfo como data direto
  closedAt: z.date().optional(),
  inquiryNumber: z.string(),
  caseType: z.string(),
  observations: z.string().optional(),
  location: z
    .object({
      latitude: z.string(),
      longitude: z.string()
    })
    .optional(),
});

//DTO para resposta de lista de casos

const caseListDTO = z.array(caseResponseDTO);

// DTO para atualização de status de caso

const caseUpdateStatusDTO = z.object({
  status: z.enum(["EM ABERTO", "FINALIZADO"]),
  closedAt: z.string().optional(),
});

module.exports = {
  caseCreateDTO,
  caseResponseDTO,
  caseListDTO,
  caseUpdateStatusDTO,
};
