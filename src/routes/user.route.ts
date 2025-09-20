import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { forgotPasswordLimiter } from "../utils/rateLimiter";
import {
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
  userUpdateAccountDetailsValidator,
} from "../validators/user/user.validators";
import { validate } from "../validators/validate";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getUser,
  getUserById,
  updateUser,
  deleteUserById,
  changeCurrentPassword,
  updateAccountDetails,
} from "../controllers/user.controller";

const router = Router();

// Public routes
router.post("/login", userLoginValidator(), validate, loginUser);
router.post("/register", userRegisterValidator(), validate, registerUser);
router.post("/refresh-token", refreshAccessToken);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  userForgotPasswordValidator(),
  validate,
  forgotPassword
);
router.patch(
  "/reset-password/:token",
  userResetForgottenPasswordValidator(),
  validate,
  resetPassword
);

// secured routes
router.get("/", verifyJWT, getUser);
router.get("/:id", verifyJWT, getUserById);
router.put("/:id", verifyJWT, updateUser);
router.delete("/:id", verifyJWT, deleteUserById);

router.patch(
  "/change-password",
  verifyJWT,
  userChangeCurrentPasswordValidator(),
  validate,
  changeCurrentPassword
);

router.patch(
  "/update-account",
  verifyJWT,
  userUpdateAccountDetailsValidator(),
  validate,
  updateAccountDetails
);
router.post("/logout", verifyJWT, logoutUser);

export default router;
