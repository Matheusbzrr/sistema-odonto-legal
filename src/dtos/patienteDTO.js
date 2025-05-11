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

const ToothAnnotationSchema = z.object({
  tooth: z.string(),
  note: z.string().optional(),
});

const RegionAnnotationSchema = z.object({
  region: z.string(),
  note: z.string().optional(),
});

const createPatientSchema = z.object({
  nic: z.string().min(1, "NIC é obrigatório."),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  age: z.number().optional(),
  cpf: z.string().optional(),
  gender: z.enum(["MASCULINO", "FEMININO", "NAO-BINARIO", "OUTRO"]).optional(),
  ethnicity: z.enum([
    "BRANCA", "PRETA", "PARDA", "AMARELA", "INDÍGENA", "NÃO INFORMADA"
  ]).optional(),
  address: AddressSchema.optional(),
  identificationStatus: z.enum([
    "IDENTIFICADO",
    "NÃO IDENTIFICADO",
    "PARCIALMENTE IDENTIFICADO",
  ]),
  odontogram: z.array(ToothAnnotationSchema).optional(),
  anatomicalRegions: z.array(RegionAnnotationSchema).optional(),
});

const responsePatienteDTO = createPatientSchema.extend({
  cases: z.array(z.any()).optional(),
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
