import { body, param } from "express-validator";

const createExperienceValidator = () => [
  body("jobTitle").trim().notEmpty().withMessage("Job title is required"),

  body("companyName").trim().notEmpty().withMessage("Company name is required"),

  body("country").trim().notEmpty().withMessage("Country is required"),

  body("city").trim().notEmpty().withMessage("City is required"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("startMonth").isInt({ min: 1, max: 12 }).withMessage("Start month must be between 1 and 12"),

  body("startYear").isInt({ min: 1900 }).withMessage("Start year must be valid"),

  body("endMonth")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("End month must be between 1 and 12"),

  body("endYear").optional().isInt({ min: 1900 }).withMessage("End year must be valid"),

  body("currentlyWorkHere").isBoolean().withMessage("CurrentlyWorkHere must be a boolean"),
];

const updateExperienceValidator = () => [
  param("experienceId").notEmpty().withMessage("Experience ID is required"),

  body("jobTitle").optional().notEmpty(),
  body("companyName").optional().notEmpty(),
  body("country").optional().notEmpty(),
  body("city").optional().notEmpty(),
  body("state").optional().notEmpty(),
  body("startMonth").optional().isInt({ min: 1, max: 12 }),
  body("startYear").optional().isInt({ min: 1900 }),
  body("endMonth").optional().isInt({ min: 1, max: 12 }),
  body("endYear").optional().isInt({ min: 1900 }),
  body("currentlyWorkHere").optional().isBoolean(),
];

const deleteExperienceValidator = () => [
  param("experienceId").notEmpty().withMessage("Experience ID is required"),
];

export { createExperienceValidator, updateExperienceValidator, deleteExperienceValidator };
