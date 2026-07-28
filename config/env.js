const { z } = require('zod');

const envSchema = z.object({
  MONGO_URI: z.string().min(1, 'MONGO_URI é obrigatório'),
  TOKEN_SECRET: z.string().min(1, 'TOKEN_SECRET é obrigatório'),
  EMAIL_USERNAME: z.string().min(1, 'EMAIL_USERNAME é obrigatório'),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD é obrigatório'),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM é obrigatório'),
  EMAIL_SUPPORT: z.string().min(1, 'EMAIL_SUPPORT é obrigatório'),
  FRONTEND_URL: z.string().optional(),
  PORT: z.string().optional(),
  HOSTNAME: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('\x1b[31m%s\x1b[0m', 'Erro nas variáveis de ambiente:');
  result.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

module.exports = result.data;