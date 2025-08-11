// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Starting seed process...');

//   // Clear existing data (optional - be careful in production)
//   await prisma.post.deleteMany({});
//   await prisma.user.deleteMany({});
//   console.log('🗑️  Cleared existing data');

//   // Create users
//   const user1 = await prisma.user.create({
//     data: {
//       name: 'Ahmed',
//       email: 'ahmed@example.com',
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       name: 'Mona',
//       email: 'mona@example.com',
//     },
//   });

//   const user3 = await prisma.user.create({
//     data: {
//       name: 'Ali',
//       email: 'ali@example.com',
//     },
//   });

//   console.log('👥 Created users:', { user1: user1.name, user2: user2.name, user3: user3.name });

//   // Create posts
//   const posts = [
//     {
//       title: 'Getting Started with Next.js',
//       content: 'Next.js is a powerful React framework that makes building web applications easier. In this post, we\'ll explore the basics of Next.js and how to get started with your first project.',
//       published: true,
//       authorId: user1.id,
//     },
//     {
//       title: 'Understanding React Hooks',
//       content: 'React Hooks revolutionized how we write React components. Learn about useState, useEffect, and other essential hooks that will make your React code more efficient and readable.',
//       published: true,
//       authorId: user2.id,
//     },
//     {
//       title: 'Database Design with Prisma',
//       content: 'Prisma is an excellent ORM for Node.js and TypeScript. This post covers database schema design, migrations, and best practices for using Prisma in your projects.',
//       published: true,
//       authorId: user3.id,
//     },
//     {
//       title: 'Building RESTful APIs',
//       content: 'Learn how to build robust RESTful APIs with proper error handling, validation, and security measures. We\'ll cover CRUD operations and best practices.',
//       published: true,
//       authorId: user1.id,
//     },
//     {
//       title: 'Draft: Advanced TypeScript Tips',
//       content: 'This is a draft post about advanced TypeScript features including generics, utility types, and conditional types. Still working on this one!',
//       published: false,
//       authorId: user2.id,
//     },
//     {
//       title: 'CSS Grid vs Flexbox',
//       content: 'A comprehensive comparison between CSS Grid and Flexbox. Learn when to use each layout method and see practical examples of both.',
//       published: true,
//       authorId: user3.id,
//     },
//   ];

//   for (const postData of posts) {
//     await prisma.post.create({ data: postData });
//   }

//   console.log('📝 Created', posts.length, 'posts');
//   console.log('✅ Seed completed successfully!');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Clear existing data (optional - be careful in production)
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'Ahmed',
      email: 'ahmed@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Mona',
      email: 'mona@example.com',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Ali',
      email: 'ali@example.com',
      password: hashedPassword,
    },
  });

  // Create Basma user for testing
  const basmaUser = await prisma.user.create({
    data: {
      name: 'Basma',
      email: 'basmalawaled.com',
      password: hashedPassword,
    },
  });

  console.log('👥 Created users:', { 
    user1: user1.name, 
    user2: user2.name, 
    user3: user3.name,
    basma: basmaUser.name 
  });

  // Create posts
  const posts = [
    {
      title: 'Getting Started with Next.js',
      content: 'Next.js is a powerful React framework that makes building web applications easier. In this post, we\'ll explore the basics of Next.js and how to get started with your first project.',
      published: true,
      authorId: user1.id,
    },
    {
      title: 'Understanding React Hooks',
      content: 'React Hooks revolutionized how we write React components. Learn about useState, useEffect, and other essential hooks that will make your React code more efficient and readable.',
      published: true,
      authorId: user2.id,
    },
    {
      title: 'Database Design with Prisma',
      content: 'Prisma is an excellent ORM for Node.js and TypeScript. This post covers database schema design, migrations, and best practices for using Prisma in your projects.',
      published: true,
      authorId: user3.id,
    },
    {
      title: 'Building RESTful APIs',
      content: 'Learn how to build robust RESTful APIs with proper error handling, validation, and security measures. We\'ll cover CRUD operations and best practices.',
      published: true,
      authorId: user1.id,
    },
    {
      title: 'Draft: Advanced TypeScript Tips',
      content: 'This is a draft post about advanced TypeScript features including generics, utility types, and conditional types. Still working on this one!',
      published: false,
      authorId: user2.id,
    },
    {
      title: 'CSS Grid vs Flexbox',
      content: 'A comprehensive comparison between CSS Grid and Flexbox. Learn when to use each layout method and see practical examples of both.',
      published: true,
      authorId: user3.id,
    },
  ];

  for (const postData of posts) {
    await prisma.post.create({ data: postData });
  }

  console.log('📝 Created', posts.length, 'posts');
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });