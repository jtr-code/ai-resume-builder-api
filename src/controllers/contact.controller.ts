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

  if (!email) {
    throw createHttpError(422, "Please provide email");
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
    },
  });

  res.status(201).json(new ApiResponse(201, contact, "Contact created successfully"));
});

export const getContactDetails = expressAsyncHandler(async (req: Request, res: Response) => {});

export const updateContact = expressAsyncHandler(async (req: Request, res: Response) => {});
