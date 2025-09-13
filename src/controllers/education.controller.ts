import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ApiResponse } from "../utils/apiResponse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEducation = expressAsyncHandler(async (req: Request, res: Response) => {
  const {
    schoolName,
    schoolLocation,
    degreeOrProgram,
    fieldOfStudy,
    graduationMonth,
    graduationYear,
    resumeId,
  } = req.body;

  if (!resumeId) throw createHttpError(422, "resumeId is required");

  const education = await prisma.education.create({
    data: {
      schoolName,
      schoolLocation,
      degreeOrProgram,
      fieldOfStudy,
      graduationMonth,
      graduationYear,
      resumeId,
    },
  });

  res.status(201).json(new ApiResponse(201, education, "Education created successfully"));
});

export const getEducations = expressAsyncHandler(async (req: Request, res: Response) => {
  const { resumeId } = req.params;

  if (!resumeId) throw createHttpError(422, "resumeId is required");

  const educations = await prisma.education.findMany({
    where: { resumeId },
    orderBy: { graduationYear: "desc" },
  });

  res.status(200).json(new ApiResponse(200, educations, "Educations retrieved successfully"));
});

export const updateEducation = expressAsyncHandler(async (req: Request, res: Response) => {
  const { educationId } = req.params;

  if (!educationId) throw createHttpError(422, "educationId is required");

  const education = await prisma.education.update({
    where: { id: educationId },
    data: { ...req.body },
  });

  res.status(200).json(new ApiResponse(200, education, "Education updated successfully"));
});

export const deleteEducation = expressAsyncHandler(async (req: Request, res: Response) => {
  const { educationId } = req.params;

  if (!educationId) throw createHttpError(422, "educationId is required");

  await prisma.education.delete({
    where: { id: educationId },
  });

  res.status(200).json(new ApiResponse(200, null, "Education deleted successfully"));
});
