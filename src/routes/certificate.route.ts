import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import {
  createCertification,
  getCertifications,
  updateCertification,
  deleteCertification,
} from "../controllers/certificate.controller";
import {
  createCertificationValidator,
  updateCertificationValidator,
} from "../validators/certificate/certificate.validator";

const router = Router();

router.post("/create", verifyJWT, createCertificationValidator(), validate, createCertification);
router.get("/:resumeId", verifyJWT, getCertifications);
router.patch(
  "/update/:certificationId",
  verifyJWT,
  updateCertificationValidator(),
  validate,
  updateCertification
);
router.delete("/delete/:certificationId", verifyJWT, deleteCertification);

export default router;
