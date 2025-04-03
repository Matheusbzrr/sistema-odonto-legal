const { z } = require("zod");

const AddressSchema = z.object({
  street: z.string().optional(),
  houseNumber: z.number().optional(),
  district: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().optional(),
  complement: z.string().optional(),
});

const createPatientSchema = z.object({
  nic: z.string().min(1, "NIC é obrigatório."),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  age: z.number().min(0, "Idade não pode ser negativa."),
  cpf: z
    .string()
    .optional(),
  address: AddressSchema.optional(),
  identificationStatus: z.enum([
    "IDENTIFICADO",
    "NÃO IDENTIFICADO",
    "PARCIALMENTE IDENTIFICADO",
  ]),
});

const responsePatienteDTO = z.object({
  nic: z.string(),
  name: z.string(),
  age: z.number(),
  cpf: z.string().length(11).optional(),
  address: AddressSchema.optional(),
  identificationStatus: z.enum([
    "IDENTIFICADO",
    "NÃO IDENTIFICADO",
    "PARCIALMENTE IDENTIFICADO",
  ]),
  dentalHistory: z.array(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const patienteList = z.array(responsePatienteDTO);

module.exports = {
  createPatientSchema,
  responsePatienteDTO,
  patienteList,
};
