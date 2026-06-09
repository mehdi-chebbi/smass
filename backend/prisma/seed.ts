import { prisma } from './utils/db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@smas.oss';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin-smas',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'SMAS',
        country: 'SENEGAL',
        role: 'ADMIN',
        isActive: true
      }
    });
    console.log('✅ Admin user created');
  } else {
    console.log('⏭️ Admin user already exists');
  }

  // Create categories
  const categories = [
    { name: 'Project Updates', nameFr: 'Mises à jour du projet', slug: 'project-updates' },
    { name: 'Events', nameFr: 'Événements', slug: 'events' },
    { name: 'Technical Reports', nameFr: 'Rapports techniques', slug: 'technical-reports' },
    { name: 'Training', nameFr: 'Formation', slug: 'training' }
  ];

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`✅ Created category: ${cat.name}`);
    }
  }

  // Create tags
  const tags = [
    { name: 'Aquifer', nameFr: 'Aquifère', slug: 'aquifer' },
    { name: 'Water Resources', nameFr: 'Ressources en eau', slug: 'water-resources' },
    { name: 'Climate', nameFr: 'Climat', slug: 'climate' },
    { name: 'Transboundary', nameFr: 'Transfrontalier', slug: 'transboundary' }
  ];

  for (const tag of tags) {
    const existing = await prisma.tag.findUnique({ where: { slug: tag.slug } });
    if (!existing) {
      await prisma.tag.create({ data: tag });
      console.log(`✅ Created tag: ${tag.name}`);
    }
  }

  // Create partners
  const partners = [
    { name: 'OSS', nameFr: 'OSS', slug: 'oss', logo: '/logos/oss.png', website: 'https://www.oss-online.org', order: 0 },
    { name: 'GEF', nameFr: 'FEM', slug: 'gef', logo: '/logos/gef.png', website: 'https://www.thegef.org', order: 1 },
    { name: 'UNEP', nameFr: 'PNUE', slug: 'unep', logo: '/logos/unep.png', website: 'https://www.unep.org', order: 2 },
    { name: 'OMVS', nameFr: 'OMVS', slug: 'omvs', logo: '/logos/omvs.png', website: 'https://www.omvs.org', order: 3 },
    { name: 'OMVG', nameFr: 'OMVG', slug: 'omvg', logo: '/logos/omvg.png', website: 'https://www.omvg.org', order: 4 }
  ];

  for (const partner of partners) {
    const existing = await prisma.partner.findUnique({ where: { slug: partner.slug } });
    if (!existing) {
      await prisma.partner.create({ data: { ...partner, isActive: true } });
      console.log(`✅ Created partner: ${partner.name}`);
    }
  }

  // Create statistics
  const statistics = [
    { label: 'Aquifer Area', labelFr: 'Superficie de l\'Aquifère', value: '350,000', unit: 'km²', order: 0 },
    { label: 'Population Served', labelFr: 'Population Desservie', value: '15+', unit: 'million', order: 1 },
    { label: 'Countries', labelFr: 'Pays', value: '4', unit: '', order: 2 },
    { label: 'Project Duration', labelFr: 'Durée du Projet', value: '5', unit: 'years', unitFr: 'ans', order: 3 }
  ];

  for (const stat of statistics) {
    const existing = await prisma.statistic.findFirst({ where: { label: stat.label } });
    if (!existing) {
      await prisma.statistic.create({ data: { ...stat, isActive: true } });
      console.log(`✅ Created statistic: ${stat.label}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
