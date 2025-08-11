import { Router } from "express";
import { createContact, getContactDetails, updateContact } from "../controllers/contact.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../validators/validate";
import {
  createContactValidator,
  updateContactValidator,
} from "../validators/contact/contact.validators";

const router = Router();

router.get("/", verifyJWT, getContactDetails);
router.post("/", verifyJWT, createContactValidator(), validate, createContact);
router.patch("/:contactId", verifyJWT, updateContactValidator(), validate, updateContact);
export default router;
