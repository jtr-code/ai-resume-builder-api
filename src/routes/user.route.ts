import { Router } from "express";
import {
  deleteUserById,
  getUser,
  getUserById,
  updateUser,
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", getCurrentUser);
router.post("/refresh", refreshAccessToken);
router.post("/change-password", changeCurrentPassword);
router.patch("/update-account", updateAccountDetails);
router.post("/logout", logoutUser);

export default router;
