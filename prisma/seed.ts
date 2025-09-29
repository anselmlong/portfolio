import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test user first
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  // Create test posts
  const posts = [
    {
      name: 'Welcome to My Portfolio',
      createdById: testUser.id,
    },
    {
      name: 'My First Project',
      createdById: testUser.id,
    },
    {
      name: 'Learning React and Next.js',
      createdById: testUser.id,
    },
    {
      name: 'Building with Prisma and tRPC',
      createdById: testUser.id,
    },
  ]

  // Delete existing posts and create new ones
  await prisma.post.deleteMany({})
  
  for (const post of posts) {
    await prisma.post.create({
      data: post,
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })