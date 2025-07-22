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
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", verifyJWT, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", changeCurrentPassword);
router.patch("/update-account", updateAccountDetails);
// secured route
router.post("/logout", verifyJWT, logoutUser);

export default router;
