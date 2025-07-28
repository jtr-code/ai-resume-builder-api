import { Router } from "express";
import { createContact, getContactDetails } from "../controllers/contact.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import { createContactValidator } from "../validators/contact/contact.validators";

const router = Router();

router.get("/", getContactDetails);
router.post("/create", verifyJWT, createContactValidator(), validate, createContact);

export default router;
