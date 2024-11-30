import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    email: 'admin@test.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN'
  },
  {
    email: 'john@test.com',
    password: 'john123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER'
  },
  {
    email: 'jane@test.com',
    password: 'jane123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'USER'
  }
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());