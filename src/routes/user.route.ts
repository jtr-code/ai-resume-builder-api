import { Router } from "express";
import {
  deleteUserById,
  getUser,
  getUserById,
  updateUser,
  addNewUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUser);
router.post("/add", addNewUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

export default router;
