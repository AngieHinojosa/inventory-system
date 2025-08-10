
export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),

  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? 'postgres',
    pass: process.env.DB_PASS ?? 'postgres',
    name: process.env.DB_NAME ?? 'inventory',
    synchronize: (process.env.DB_SYNC ?? 'true') === 'true', 
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
});
