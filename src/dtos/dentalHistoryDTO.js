const z = require("zod");

const createDentalHistorySchema = z.object({
  nic: z.string().min(1, "NIC é obrigatório"),
  examType: z.enum([
    "CLÍNICO",
    "RADIOGRÁFICO",
    "FOTOGRÁFICO",
    "DOCUMENTAL",
    "MOLECULAR",
    "TOXICOLÓGICO",
    "LESIONAL",
    "DIGITAL",
    "PALATOSCÓPICO",
    "ANTROPOSCÓPICO",
    "ODONTOSCOPIA",
  ]),
  description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  toothCharting: z.record(z.any(), z.string()).optional(),
  photo: z.string().optional(),
  injuryDetails: z.string().optional(),
});

const updateDentalHistorySchema = createDentalHistorySchema.partial();

const responseDentalHistorySchema = z.object({
  protocolDental: z.any(),
  examType: z.enum([
    "CLÍNICO",
    "RADIOGRÁFICO",
    "FOTOGRÁFICO",
    "DOCUMENTAL",
    "MOLECULAR",
    "TOXICOLÓGICO",
    "LESIONAL",
    "DIGITAL",
    "PALATOSCÓPICO",
    "ANTROPOSCÓPICO",
    "ODONTOSCOPIA",
  ]),
  description: z.string(),
  toothCharting: z.record(z.any(), z.string()).optional(),
  photo: z.string().optional(),
  idPatient: z.any(),
  examiner: z.any(),
  injuryDetails: z.string(),
});

const listResponse = z.array(responseDentalHistorySchema)

module.exports = {
  createDentalHistorySchema,
  updateDentalHistorySchema,
  responseDentalHistorySchema,
  listResponse
};
