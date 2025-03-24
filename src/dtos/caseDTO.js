const { z} = require("zod");

const caseCreateDTO = z.object({
    nic: z.string().min(2, "O nic é obrigatório." ),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    status: z.enum(["PENDENTE", "FINALIZADO"]),
    inquiryNumber: z.string().min(1, "O número do inquérito é obrigatório"),
    caseType: z.string().min(3, "O tipo do caso deve ter pelo menos 3 caracteres"),
    observations: z.string().optional(),
    role: z.string(),
    location: z.object({
        latitude: z.string().optional(), 
        longitude: z.string().optional()
    }),
});

//DTO para resposta de caso único
const caseResponseDTO = z.object({
    nic: z.string(),
    title: z.string(),
    status: z.enum(["PENDENTE", "FINALIZADO"]),
    openedAt: z.string(),
    closedAt: z.string().optional(),
    inquiryNumber: z.string(),
    caseType: z.string(),
    observations: z.string(),
    location: z.object({
        latitude: z.string().optional(),
        longitude: z.string().optional()
    }),
});

//DTO para resposta de lista de casos

const caseListDTO = z.array(caseResponseDTO);

// DTO para atualização de status de caso

const caseUpdateStatusDTO= z.object({
    status: z.enum(["PENDENTE", "FINALIZADO"]),
    closedAt: z.string().optional(),
});

module.exports = {
    caseCreateDTO,
    caseResponseDTO,
    caseListDTO,
    caseUpdateStatusDTO

};





