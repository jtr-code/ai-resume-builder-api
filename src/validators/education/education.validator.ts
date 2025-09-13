import { body, param } from "express-validator";

const createEducationValidator = () => [
  body("schoolName").notEmpty().withMessage("School name is required"),
  body("schoolLocation").notEmpty().withMessage("School location is required"),
  body("degreeOrProgram").notEmpty().withMessage("Degree or program is required"),
  body("fieldOfStudy").notEmpty().withMessage("Field of study is required"),
  body("graduationMonth")
    .isInt({ min: 1, max: 12 })
    .withMessage("Graduation month must be between 1 and 12"),
  body("graduationYear").isInt({ min: 1900 }).withMessage("Graduation year must be valid"),
  body("resumeId")
    .notEmpty()
    .withMessage("Resume ID is required")
    .isUUID()
    .withMessage("Resume ID must be a valid UUID"),
];

const updateEducationValidator = () => [
  param("educationId").notEmpty().isUUID().withMessage("Education ID must be a valid UUID"),
];

export { createEducationValidator, updateEducationValidator };
