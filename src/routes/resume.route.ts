import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller";
import {
  createResumeValidator,
  updateResumeValidator,
} from "../validators/resume/resume.validator";
import { validate } from "../validators//validate";

const router = express.Router();

router.post("/create", verifyJWT, createResumeValidator(), validate, createResume);
router.get("/", verifyJWT, getResumes);
router.get("/:resumeId", verifyJWT, getResumeById);
router.patch("/update/:resumeId", verifyJWT, updateResumeValidator(), validate, updateResume);
router.delete("/delete/:resumeId", verifyJWT, deleteResume);

export default router;
