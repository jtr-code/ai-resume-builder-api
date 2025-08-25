import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ApiResponse } from "../utils/apiResponse";

const prisma = new PrismaClient();

export const createExperience = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const {
    jobTitle,
    companyName,
    country,
    city,
    state,
    startMonth,
    startYear,
    endMonth,
    endYear,
    currentlyWorkHere,
  } = req.body;

  let resume = await prisma.resume.findFirst({
    where: { userId },
    include: { experiences: true },
  });

  if (!resume) {
    resume = await prisma.resume.create({
      data: {
        userId,
        title: "",
        summary: "",
        templateStyle: "default",
      },
      include: { experiences: true },
    });
  }

  const experience = await prisma.experience.create({
    data: {
      jobTitle,
      companyName,
      country,
      city,
      state,
      startMonth,
      startYear,
      endMonth,
      endYear,
      currentlyWorkHere,
      resumeId: resume!.id,
    },
  });

  res.status(201).json(new ApiResponse(201, experience, "Experience created successfully"));
});

export const getExperiences = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const resume = await prisma.resume.findFirst({
    where: { userId },
    include: { experiences: true },
  });

  if (!resume || resume.experiences.length === 0) {
    throw createHttpError(404, "No experiences found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, resume.experiences, "Experiences retrieved successfully"));
});

export const updateExperience = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const { experienceId } = req.params;
  const {
    jobTitle,
    companyName,
    country,
    city,
    state,
    startMonth,
    startYear,
    endMonth,
    endYear,
    currentlyWorkHere,
  } = req.body;

  const experience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      resume: { userId },
    },
  });

  if (!experience) throw createHttpError(404, "Experience not found");

  const updated = await prisma.experience.update({
    where: { id: experience.id },
    data: {
      jobTitle,
      companyName,
      country,
      city,
      state,
      startMonth,
      startYear,
      endMonth,
      endYear,
      currentlyWorkHere,
    },
  });

  res.status(200).json(new ApiResponse(200, updated, "Experience updated successfully"));
});

export const deleteExperience = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const { experienceId } = req.params;

  const experience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      resume: { userId },
    },
  });

  if (!experience) throw createHttpError(404, "Experience not found");

  await prisma.experience.delete({
    where: { id: experience.id },
  });

  res.status(200).json(new ApiResponse(200, {}, "Experience deleted successfully"));
});
