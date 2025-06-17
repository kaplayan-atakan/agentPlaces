import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3001'),
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'agentplaces-jwt-secret-key-development',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
