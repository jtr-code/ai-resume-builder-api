import { Router } from "express";
import { createContact, getContactDetails } from "../controllers/contact.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getContactDetails);
router.post("/create", verifyJWT, createContact);

export default router;
