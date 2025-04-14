const { z } = require("zod");

const evidenceConditionEnum = z.enum([
  "INTEGRA",
  "ALTERADA",
  "DANIFICADA",
  "CORROMPIDO",
  "CONTAMINADA",
  "APAGADA",
  "VOLATIL",
  "INACESSIVEL",
]);

const evidenceCategoryEnum = z.enum([
  "RADIOGRAFICA",
  "FOTOGRAFICA",
  "DOCUMENTAL",
  "BIOLOGICA",
  "LESIONAL",
]);

const createEvidenceDTO = z
  .object({
    title: z.string().min(1, "Informe o titulo"),
    testimony: z.string().optional(),
    descriptionTechnical: z.string().min(1, "Description is required"),
    condition: evidenceConditionEnum,
    photo: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    obs: z.string().optional(),
    category: evidenceCategoryEnum,
  })
  .strict();

const responseEvidence = z.object({
  id: z.string(),
  title: z.string(),
  testimony: z.string().optional(),
  descriptionTechnical: z.string(),
  idCase: z.any(),
  condition: evidenceConditionEnum,
  photo: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  obs: z.string().optional(),
  collector: z.any(),
  category: evidenceCategoryEnum.optional(),
  createdAt: z.any(),
  updatedAt: z.any(),
  deletedAt: z.date().optional(),
  reportEvidence: z.any().optional(),
});

const updateEvidenceDTO = createEvidenceDTO.partial();

const updateEvidenceVerified = z.object({
  evidenceVerified: z.boolean(),
});

const listEvidenceResponseDTO = z.array(responseEvidence);

module.exports = {
  createEvidenceDTO,
  responseEvidence,
  updateEvidenceDTO,
  updateEvidenceVerified,
  listEvidenceResponseDTO,
};
