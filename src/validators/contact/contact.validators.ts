import { body } from "express-validator";

const createContactValidator = () => [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
];

export { createContactValidator };
