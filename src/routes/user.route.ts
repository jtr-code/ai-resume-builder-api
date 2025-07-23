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
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", changeCurrentPassword);
router.patch("/update-account", updateAccountDetails);

// secured route
router.get("/:id", verifyJWT, getUserById);
router.post("/logout", verifyJWT, logoutUser);

export default router;
