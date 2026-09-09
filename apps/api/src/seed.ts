import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { UserRole } from '@church/types';

async function seed() {
  const isNeon = process.env.DB_HOST?.includes('neon.tech');
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isNeon ? { rejectUnauthorized: false } : false,
    synchronize: false,
    entities: [User],
  });

  await ds.initialize();
  const repo = ds.getRepository(User);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@gracechapel.org';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await ds.destroy();
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = repo.create({ email, passwordHash: hash, role: UserRole.ADMIN });
  await repo.save(user);
  console.log(`Seeded admin: ${email} / ${password}`);
  await ds.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
