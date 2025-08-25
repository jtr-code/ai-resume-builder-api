import { Router } from "express";
import {
  createExperience,
  deleteExperience,
  updateExperience,
  getExperiences,
} from "../controllers/experience.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import {
  createExperienceValidator,
  updateExperienceValidator,
  deleteExperienceValidator,
} from "../validators/experience/experience.validators";

const router = Router();

router.get("/", verifyJWT, getExperiences);
router.post("/", verifyJWT, createExperienceValidator(), validate, createExperience);
router.put("/:experienceId", verifyJWT, updateExperienceValidator(), validate, updateExperience);
router.delete("/:experienceId", verifyJWT, deleteExperienceValidator(), validate, deleteExperience);

export default router;
