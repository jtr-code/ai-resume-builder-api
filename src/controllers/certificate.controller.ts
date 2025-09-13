import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/apiResponse";
import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCertification = expressAsyncHandler(async (req: Request, res: Response) => {
  const { name, issuer, issueDate, expiryDate, resumeId } = req.body;

  if (!resumeId) throw createHttpError(422, "Resume ID is required");

  const certification = await prisma.certification.create({
    data: { name, issuer, issueDate, expiryDate, resumeId },
  });

  res.status(201).json(new ApiResponse(201, certification, "Certification created successfully"));
});

export const getCertifications = expressAsyncHandler(async (req: Request, res: Response) => {
  const { resumeId } = req.params;
  if (!resumeId) throw createHttpError(422, "Resume ID is required");

  const certifications = await prisma.certification.findMany({
    where: { resumeId },
  });

  res
    .status(200)
    .json(new ApiResponse(200, certifications, "Certifications retrieved successfully"));
});

export const updateCertification = expressAsyncHandler(async (req: Request, res: Response) => {
  const { certificationId } = req.params;

  const certification = await prisma.certification.update({
    where: { id: certificationId },
    data: req.body,
  });

  res.status(200).json(new ApiResponse(200, certification, "Certification updated successfully"));
});

export const deleteCertification = expressAsyncHandler(async (req: Request, res: Response) => {
  const { certificationId } = req.params;

  await prisma.certification.delete({ where: { id: certificationId } });

  res.status(200).json(new ApiResponse(200, null, "Certification deleted successfully"));
});
