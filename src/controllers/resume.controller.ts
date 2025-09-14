import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ApiResponse } from "../utils/apiResponse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createResume = expressAsyncHandler(async (req: Request, res: Response) => {
  const { title, summary, templateStyle } = req.body;
  const userId = req.user?.id;

  if (!userId) throw createHttpError(401, "Unauthorized");

  const resume = await prisma.resume.create({
    data: {
      title,
      summary,
      templateStyle,
      userId,
    },
  });

  res.status(201).json(new ApiResponse(201, resume, "Resume created successfully"));
});

export const getResumes = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) throw createHttpError(401, "Unauthorized");

  const resumes = await prisma.resume.findMany({
    where: { userId },
    include: {
      contact: true,
      experiences: true,
      educations: true,
      certification: true,
      skills: true,
    },
  });

  res.status(200).json(new ApiResponse(200, resumes, "Resumes retrieved successfully"));
});

export const getResumeById = expressAsyncHandler(async (req: Request, res: Response) => {
  const { resumeId } = req.params;

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      contact: true,
      experiences: true,
      educations: true,
      certification: true,
      skills: true,
    },
  });

  if (!resume) throw createHttpError(404, "Resume not found");

  res.status(200).json(new ApiResponse(200, resume, "Resume retrieved successfully"));
});

export const updateResume = expressAsyncHandler(async (req: Request, res: Response) => {
  const { resumeId } = req.params;
  const { title, summary, templateStyle } = req.body;

  const resume = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      title,
      summary,
      templateStyle,
    },
  });

  res.status(200).json(new ApiResponse(200, resume, "Resume updated successfully"));
});

export const deleteResume = expressAsyncHandler(async (req: Request, res: Response) => {
  const { resumeId } = req.params;

  await prisma.resume.delete({
    where: { id: resumeId },
  });

  res.status(200).json(new ApiResponse(200, null, "Resume deleted successfully"));
});
