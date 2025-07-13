import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error: any) {
    console.error("❌ Error connecting to the database:", error.message);
    process.exit(1);
  }
};
