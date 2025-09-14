import { body, param } from "express-validator";

const createResumeValidator = () => [
  body("title").notEmpty().withMessage("Title is required"),
  body("summary").notEmpty().withMessage("Summary is required"),
  body("templateStyle").notEmpty().withMessage("Template style is required"),
];

const updateResumeValidator = () => [
  param("resumeId").isUUID().withMessage("Invalid resume ID"),
  body("title").optional().isString(),
  body("summary").optional().isString(),
  body("templateStyle").optional().isString(),
];

export { createResumeValidator, updateResumeValidator };
