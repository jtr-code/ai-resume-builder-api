import { body, param } from "express-validator";

const createContactValidator = () => [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
];

const updateContactValidator = () => [
  param("contactId")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isUUID()
    .withMessage("Contact ID must be a valid UUID"),
];
export { createContactValidator, updateContactValidator };
