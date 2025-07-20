import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "JTR Dev",
      email: "jtr@example.com",
      password: "12345678",
    },
  });

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Full Stack Dev Resume",
      summary: "Experienced MERN/React Native Developer.",
      templateStyle: "modern",
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        resumeId: resume.id,
        jobTitle: "Frontend Developer",
        companyName: "DevX Corp",
        country: "USA",
        city: "New York",
        state: "NY",
        startMonth: 5,
        startYear: 2021,
        endMonth: 4,
        endYear: 2023,
        currentlyWorkHere: false,
      },
    ],
  });

  await prisma.education.create({
    data: {
      resumeId: resume.id,
      schoolName: "Code University",
      schoolLocation: "Berlin, Germany",
      degreeOrProgram: "B.Sc Computer Science",
      fieldOfStudy: "Software Engineering",
      graduationMonth: 6,
      graduationYear: 2020,
    },
  });

  await prisma.skill.createMany({
    data: [
      { resumeId: resume.id, name: "React", proficiency: "Advanced" },
      { resumeId: resume.id, name: "Node.js", proficiency: "Intermediate" },
    ],
  });

  await prisma.certification.create({
    data: {
      resumeId: resume.id,
      name: "AWS Certified Developer",
      issuer: "Amazon",
      issueDate: new Date("2022-01-15"),
    },
  });

  await prisma.contact.create({
    data: {
      resumeId: resume.id,
      image: "https://example.com/avatar.png",
      firstName: "jishnu",
      lastName: "raj",
      jobTitle: "Full Stack Developer",
      phone: "1234567890",
      country: "USA",
      city: "NYC",
      state: "NY",
      email: "jishnu.raj@example.com",
      pincode: "10001",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
      dob: new Date("2000-09-19"),
    },
  });

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
