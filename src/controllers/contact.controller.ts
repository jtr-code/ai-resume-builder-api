import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ApiResponse } from "../utils/apiResponse";

const prisma = new PrismaClient();

export const createContact = expressAsyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    image,
    jobTitle,
    phone,
    country,
    city,
    state,
    email,
    pincode,
    linkedin,
    website,
    dob,
  } = req.body;

  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");
  if (!email) throw createHttpError(422, "Please provide email");

  let resume = await prisma.resume.findFirst({
    where: { userId },
    include: { contact: true },
  });

  if (!resume) {
    resume = await prisma.resume.create({
      data: {
        userId,
        title: "",
        summary: "",
        templateStyle: "default",
      },
      include: { contact: true },
    });
  }

  if (resume.contact) {
    const updatedContact = await prisma.contact.update({
      where: { id: resume.contact.id },
      data: {
        firstName,
        lastName,
        image,
        jobTitle,
        phone,
        country,
        city,
        state,
        email,
        pincode,
        linkedin,
        website,
        dob,
      },
    });
    res.status(200).json(new ApiResponse(200, updatedContact, "Contact updated successfully"));
  }

  const contact = await prisma.contact.create({
    data: {
      firstName,
      lastName,
      image,
      jobTitle,
      phone,
      country,
      city,
      state,
      email,
      pincode,
      linkedin,
      website,
      dob,
      resumeId: resume.id,
    },
  });

  res.status(201).json(new ApiResponse(201, contact, "Contact created successfully"));
});

export const getContactDetails = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const resume = await prisma.resume.findFirst({
    where: { userId },
    include: { contact: true },
  });

  if (!resume || !resume.contact) {
    throw createHttpError(200, "No contact found");
  }

  res.status(200).json(new ApiResponse(200, resume.contact, "Contact retrieved successfully"));
});

export const deleteContact = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const resume = await prisma.resume.findFirst({
    where: { userId },
    include: { contact: true },
  });

  if (!resume || !resume.contact) {
    throw createHttpError(404, "No contact found to delete");
  }

  await prisma.contact.delete({
    where: { id: resume.contact.id },
  });

  res.status(200).json(new ApiResponse(200, {}, "Contact deleted successfully"));
});
