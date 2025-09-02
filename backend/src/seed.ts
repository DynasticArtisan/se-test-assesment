import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { connectDB } from "./config/database";
import { Users } from "./users/users.model";

async function seed() {
  await connectDB();
  await Users.deleteMany({});

  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      passwordHash: faker.internet.password(), // если нужно
    });
  }

  await Users.insertMany(users);

  console.log(`✅ Inserted ${users.length} users`);
  await mongoose.disconnect();
}

seed().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await mongoose.disconnect();
  process.exit(1);
});