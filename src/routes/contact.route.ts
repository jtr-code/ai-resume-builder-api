import { Router } from "express";
import { createContact, deleteContact, getContactDetails } from "../controllers/contact.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import { createContactValidator } from "../validators/contact/contact.validators";

const router = Router();

router.get("/", verifyJWT, getContactDetails);
router.post("/", verifyJWT, createContactValidator(), validate, createContact);
router.delete("/", verifyJWT, deleteContact);

export default router;
