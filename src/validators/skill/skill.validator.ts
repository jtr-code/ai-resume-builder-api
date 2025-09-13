import { body, param } from "express-validator";

export const createSkillValidator = () => [
  body("name").trim().notEmpty().withMessage("Skill name is required"),
  body("proficiency")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Proficiency must be Beginner, Intermediate, or Advanced"),
  body("resumeId").notEmpty().withMessage("Resume ID is required"),
];

export const updateSkillValidator = () => [
  param("skillId").notEmpty().withMessage("Skill ID is required"),
];
