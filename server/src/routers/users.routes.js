import express from "express";
import userController from "../controller/user.controller.js";
import { validateUserRegistration, validateUserLogin } from "../middleware/validation.js";
import authenticate from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validateUserRegistration, userController.registerUser);
router.post("/verify-email", userController.verifyEmail);
router.get("/verify-email", userController.verifyEmail);
router.post("/resend-verification", userController.resendVerificationEmail);
router.post("/login", validateUserLogin, userController.userLogin);
router.get("/me", authenticate, userController.getCurrentUser);
router.post("/logout", userController.userLogout);
router.post("/forget-password", userController.forgetPassword);
router.post("/verify-otp/:email", userController.verifyOtp);
router.post("/change-password/:email", userController.changePassword);

export default router;