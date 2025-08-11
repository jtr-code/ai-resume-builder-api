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
    userId,
  } = req.body;

  if (!email) {
    throw createHttpError(422, "Please provide email");
  }
  if (!userId) {
    throw createHttpError(401, "Unauthorized");
  }

  let resume = await prisma.resume.findFirst({
    where: { userId },
  });

  if (!resume) {
    resume = await prisma.resume.create({
      data: {
        userId,
        title: "",
        summary: "",
        templateStyle: "default",
      },
    });
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
  const { userId } = req.body;
  if (!userId) throw createHttpError(401, "Unauthorized");

  const resume = await prisma.resume.findFirst({
    where: { userId },
    include: { contacts: true },
  });

  if (!resume || resume.contacts.length === 0) {
    throw createHttpError(404, "No contacts found");
  }

  res.status(200).json(new ApiResponse(200, resume.contacts, "Contacts retrieved successfully"));
});

export const updateContact = expressAsyncHandler(async (req: Request, res: Response) => {
  const { contactId } = req.params;
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

  const contact = await prisma.contact.update({
    where: { id: contactId },
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

  res.status(200).json(new ApiResponse(200, contact, "Contact updated successfully"));
});
