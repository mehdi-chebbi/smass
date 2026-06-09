import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  console.log('🌱 Seeding admin user...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@smas.oss';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin-smas';

  // Check if admin already exists
  const existingAdmin = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    console.log(`   Email: ${adminEmail}`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  await db.user.create({
    data: {
      email: adminEmail,
      username: adminUsername,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'SMAS',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created successfully');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Username: ${adminUsername}`);
}

// Run the seed function
seedAdmin()
  .catch((e) => {
    console.error('❌ Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
