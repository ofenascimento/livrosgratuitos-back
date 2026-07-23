const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('invalid email'),
  password: z.string().min(6, 'password must be at least 6 characters'),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('invalid email'),
  password: z.string().min(1, 'password is required'),
});

const recoverPasswordSchema = z.object({
  email: z.string().email('invalid email'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'password must be at least 6 characters'),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('invalid email').optional(),
  password: z.string().min(6, 'password must be at least 6 characters').optional(),
});

const bookIdSchema = z.object({
  bookId: z.string().min(1, 'bookId is required'),
});

const saveProgressSchema = z.object({
  bookId: z.string().min(1, 'bookId is required'),
  progress: z.number(),
  progressPercentage: z.number().optional(),
  currentParagraph: z.number().optional(),
  cfi: z.string().optional(), 
});

module.exports = {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  bookIdSchema,
  saveProgressSchema,
};