import { prisma } from "./prisma";

async function main() {
  // Create users first
  const user1 = await prisma.user.create({
    data: {
      name: "Ahmed",
      email: "ahmed@example.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Mona",
      email: "mona@example.com",
    },
  });

  // Create posts for the users
  await prisma.post.create({
    data: {
      title: "Hello World",
      content: "This is my first post about getting started with Next.js and Prisma!",
      published: true,
      authorId: user1.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Learning React",
      content: "React is an amazing library for building user interfaces. Here are some tips and tricks I've learned.",
      published: true,
      authorId: user2.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Draft Post",
      content: "This is a draft post that hasn't been published yet.",
      published: false,
      authorId: user1.id,
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .then(() => {
    console.log("🌱 Seed successful");
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;