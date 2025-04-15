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
  age: z.number().optional(),
  cpf: z.string().optional(),
  gender: z.enum(["MASCULINO", "FEMININO", "NAO-BINARIO", "OUTRO"]).optional(),
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
  age: z.number().optional(),
  cpf: z.string().optional(),
  gender: z.enum(["MASCULINO", "FEMININO", "NAO-BINARIO", "OUTRO"]).optional(),
  address: AddressSchema.optional(),
  identificationStatus: z.enum([
    "IDENTIFICADO",
    "NÃO IDENTIFICADO",
    "PARCIALMENTE IDENTIFICADO",
  ]),
  idCase: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const patienteList = z.array(responsePatienteDTO);

const updatePatientSchema = createPatientSchema.omit({ nic: true }).partial();

module.exports = {
  createPatientSchema,
  responsePatienteDTO,
  patienteList,
  updatePatientSchema,
};
