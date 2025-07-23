import { Router } from "express";
import {
  deleteUserById,
  getUser,
  getUserById,
  updateUser,
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { forgotPasswordLimiter } from "../utils/rateLimiter";
import { validate } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.get("/", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.patch("/reset-password", resetPassword);

// secured route
router.get("/:id", verifyJWT, getUserById);
router.patch("/change-password", verifyJWT, changeCurrentPassword);
router.patch("/update-account", verifyJWT, updateAccountDetails);
router.post("/logout", verifyJWT, logoutUser);

export default router;
