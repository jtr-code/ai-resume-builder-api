import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import { createSkill, getSkills, updateSkill, deleteSkill } from "../controllers/skill.controller";
import { createSkillValidator, updateSkillValidator } from "../validators/skill/skill.validator";

const router = Router();

router.post("/create", verifyJWT, createSkillValidator(), validate, createSkill);
router.get("/:resumeId", verifyJWT, getSkills);
router.patch("/update/:skillId", verifyJWT, updateSkillValidator(), validate, updateSkill);
router.delete("/delete/:skillId", verifyJWT, deleteSkill);

export default router;
