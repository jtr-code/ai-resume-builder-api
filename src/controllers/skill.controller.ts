// controllers/skill.controller.ts
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/apiResponse";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSkill = expressAsyncHandler(async (req: Request, res: Response) => {
  const { name, proficiency, resumeId } = req.body;

  if (!resumeId) throw createHttpError(422, "Resume ID is required");

  const skill = await prisma.skill.create({
    data: { name, proficiency, resumeId },
  });

  res.status(201).json(new ApiResponse(201, skill, "Skill created successfully"));
});

export const getSkills = expressAsyncHandler(async (req: Request, res: Response) => {
  const { resumeId } = req.params;
  if (!resumeId) throw createHttpError(422, "Resume ID is required");

  const skills = await prisma.skill.findMany({
    where: { resumeId },
  });

  res.status(200).json(new ApiResponse(200, skills, "Skills retrieved successfully"));
});

export const updateSkill = expressAsyncHandler(async (req: Request, res: Response) => {
  const { skillId } = req.params;

  const skill = await prisma.skill.update({
    where: { id: skillId },
    data: req.body,
  });

  res.status(200).json(new ApiResponse(200, skill, "Skill updated successfully"));
});

export const deleteSkill = expressAsyncHandler(async (req: Request, res: Response) => {
  const { skillId } = req.params;

  await prisma.skill.delete({ where: { id: skillId } });

  res.status(200).json(new ApiResponse(200, null, "Skill deleted successfully"));
});
