import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller";
import {
  createEducationValidator,
  updateEducationValidator,
} from "../validators/education/education.validator";

const router = express.Router();

router.post("/", verifyJWT, createEducationValidator(), validate, createEducation);
router.get("/:resumeId", verifyJWT, getEducations);
router.patch("/:educationId", verifyJWT, updateEducationValidator(), validate, updateEducation);
router.delete("/:educationId", verifyJWT, updateEducationValidator(), validate, deleteEducation);

export default router;
