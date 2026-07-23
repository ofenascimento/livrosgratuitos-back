const { z } = require('zod');

const saveProgressSchema = z.object({
  livroId: z.string().min(1, 'livroId is required'),
  progressPercentage: z.number().min(0).max(100).optional(),
  currentCfi: z.string().optional(),
  currentHref: z.string().optional(),
});

module.exports = { saveProgressSchema };