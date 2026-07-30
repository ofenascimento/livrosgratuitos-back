const { z } = require('zod');

const epubInfoSchema = z.object({
  font: z.string().optional(),
  fontLink: z.string().optional(),
  license: z.string().optional(),
  licenseLink: z.string().optional(),
  modified: z.string().optional(),
  translatedByAI: z.boolean().optional(),
}).optional();

const createLivroSchema = z.object({
  titulo: z.string().min(1, 'titulo is required'),
  autor: z.string().min(1, 'autor is required'),
  descricao: z.string().optional(),
  categoria: z.array(z.string()).optional(),
  capa: z.string().optional(),
  txt: z.string().optional(),
  pdf: z.string().optional(),
  epub: z.string().optional(),
  urlHtml: z.string().optional(),
  destaque: z.boolean().optional(),
  epubInfo: epubInfoSchema,
});

const updateLivroSchema = createLivroSchema.partial();

module.exports = { createLivroSchema, updateLivroSchema };