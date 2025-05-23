const { z } = require("zod");

const validEnumDTO = z.object({
  status: z.enum(["PENDENTE", "APROVADO", "NEGADO"]),
});

// valida dados do endereço
const addressCreateDTO = z.object({
  street: z.string(),
  houseNumber: z.number(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().min(8, "O CEP deve ter pelo menos 8 caracteres."),
  complement: z.string().optional(),
});

// valida os dados do usuario para sua criação
const userCreateDTO = z
  .object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    lastName: z.string().optional(),
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
      houseNumber: z.number(),
      district: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string().min(8, "O CEP deve ter pelo menos 8 caracteres."),
      complement: z.string().optional(),
    }),
    isActive: z.boolean().optional(),
  })
  .strict();

// valida os dados para o login
const userLoginDTO = z
  .object({
    cpf: z.string().length(11, "O CPF deve ter exatamente 11 dígitos."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    role: z.enum(["ADMIN", "PERITO", "ASSISTENTE"]),
  })
  .strict();

// trata os dados para resposta com endereço
const userResponseWithAddressDTO = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string().optional(),
  email: z.string(),
  role: z.string(),
  cpf: z.string(),
  dateOfBirth: z.string(),
  address: z.object({
    street: z.string(),
    houseNumber: z.number(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    complement: z.string().optional().default("Não informado"),
  }),
});

const listUsersResponseWithAddressDTO = z.array(userResponseWithAddressDTO);

const updateDTO = userCreateDTO
  .partial() 
  .extend({
    
    id: z.string(),
  });
module.exports = {
  validEnumDTO,
  addressCreateDTO,
  userCreateDTO,
  userLoginDTO,
  userResponseWithAddressDTO,
  listUsersResponseWithAddressDTO,
  updateDTO,
};
