import { body, param } from "express-validator";

export const createCertificationValidator = () => [
  body("name").trim().notEmpty().withMessage("Certification name is required"),
  body("issuer").trim().notEmpty().withMessage("Issuer is required"),
  body("issueDate").isISO8601().withMessage("Issue date must be a valid date"),
  body("resumeId").notEmpty().withMessage("Resume ID is required"),
];

export const updateCertificationValidator = () => [
  param("certificationId").notEmpty().withMessage("Certification ID is required"),
];
