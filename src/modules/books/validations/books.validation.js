const { z } = require('zod');

const epubInfoSchema = z.object({
  font: z.string().optional(),
  fontLink: z.string().optional(),
  license: z.string().optional(),
  licenseLink: z.string().optional(),
  modified: z.string().optional(),
  translatedByAI: z.boolean().optional(),
}).optional();

const createBookSchema = z.object({
  title: z.string().min(1, 'title is required'),
  author: z.string().min(1, 'author is required'),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  cover: z.string().optional(),
  txt: z.string().optional(),
  pdf: z.string().optional(),
  epub: z.string().optional(),
  htmlUrl: z.string().optional(),
  featured: z.boolean().optional(),
  epubInfo: epubInfoSchema,
});

const updateBookSchema = createBookSchema.partial();

module.exports = { createBookSchema, updateBookSchema };