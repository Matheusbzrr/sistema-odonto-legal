const { z } = require("zod");

// valida os dados para sua criação
const userCreateDTO = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  role: z.enum(["ADMIN", "PERITO", "ASSISTENTE"]),
  cpf: z.string().length(11, "O CPF deve ter exatamente 11 dígitos."),
  dateOfBirth: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "A data de nascimento deve estar no formato DD/MM/YYYY."
    ),
  address: z.object({
    street: z.string(),
    numberHouse: z.number(), //houseNumber
    district: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string().min(8, "O CEP deve ter pelo menos 8 caracteres."),
    complement: z.string().optional(),
  }),
});

// valida os dados para o login
const userLoginDTO = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  role: z.enum(["ADMIN", "PERITO", "ASSISTENTE"]),
});

// trata os dados para resposta com endereço
const userResponseWithAddressDTO = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
  cpf: z.string(),
  dateOfBirth: z.string(),
  address: z.object({
    street: z.string(),
    numberHouse: z.number(), //houseNumber
    district: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    complement: z.string().optional().default("Não informado"),
  }),
});

// trata os dados para resposta de filtros
const userResponseFiltersDTO = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    cpf: z.string(),
    status: z.string(),
    approvedBy: z.string().optional(),
  })
);

// valida os dados para o update de status do usuário
const userUpdateStatusDTO = z.object({
  status: z.enum(["APROVADO", "NEGADO"]),
  approvedBy: z.string(),
});

const responseUpdateStatusDTO = z.object({
  name: z.string(),
    email: z.string(),
    role: z.string(),
    cpf: z.string(),
    status: z.string(),
    approvedBy: z.string().optional(),
  
});

module.exports = {
  userCreateDTO,
  userResponseWithAddressDTO,
  userResponseFiltersDTO,
  userLoginDTO,
  userUpdateStatusDTO,
  responseUpdateStatusDTO
};
