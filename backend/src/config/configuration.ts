export default () => ({
  port: parseInt(process.env.PORT, 10) || 2809,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agentplaces',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://kaplayan-atakan.github.io' 
      : 'http://localhost:3009',
    credentials: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  llm: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
    },
  },
  storage: {
    path: process.env.STORAGE_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
  },
});
