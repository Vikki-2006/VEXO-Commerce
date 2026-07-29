import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'aura_super_secret_jwt_key_2026_prod',
  nodeEnv: process.env.NODE_ENV || 'development',
};
