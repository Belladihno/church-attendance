import 'dotenv/config';
import { DataSource } from 'typeorm';

// Entities will be added in Step 4 — keep empty for Step 3 wiring.
// Use glob for CLI so future entities are picked up without manual update if needed,
// but AppModule uses explicit entity list for runtime.
const isNeon = process.env.DB_HOST?.includes('neon.tech');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: isNeon ? { rejectUnauthorized: false } : false, // Neon requires SSL; local pgAdmin does not
  synchronize: false,
  logging: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
