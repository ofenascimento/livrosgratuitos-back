const { z } = require('zod');

const saveProgressSchema = z.object({
  bookId: z.string().min(1, 'bookId is required'),
  progressPercentage: z.number().min(0).max(100).optional(),
  currentCfi: z.string().optional(),
  currentHref: z.string().optional(),
});

module.exports = { saveProgressSchema };