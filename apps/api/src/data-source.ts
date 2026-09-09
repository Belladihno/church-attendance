import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

const isNeon = process.env.DB_HOST?.includes('neon.tech');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: isNeon ? { rejectUnauthorized: false } : false,
  synchronize: false,
  entities: [path.join(__dirname, '..', 'dist', '**', '*.entity.js')],
  migrations: [path.join(__dirname, '..', 'dist', 'migrations', '*.js')],
});
