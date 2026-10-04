import userModel from "../models/user.models.js";
import sessionModel from "../models/session.model.js";
import bcrypt from "bcryptjs";
import { varifyEmail } from "../emailVarify/emailVarify.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {sendOtpEmail} from "../emailVarify/sendOtpMail.js";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    newUser.token = token;
    await newUser.save();

    // Send verification email
    await varifyEmail(token, email);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isVerified: newUser.isVerified,
        token: newUser.token,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const queryToken = req.query.token;
    const authorization = req.headers.authorization;
    const [scheme, headerToken] = authorization?.split(" ") ?? [];
    const token = queryToken || (scheme === "Bearer" ? headerToken : undefined);

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findOne({ _id: decoded.id, token });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.token = undefined;
    await user.save();

    if (req.method === "GET") {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(
        `${clientUrl}/email-varify?verified=true&email=${encodeURIComponent(user.email)}`,
      );
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    user.token = token;
    await user.save();
    await varifyEmail(token, user.email);

    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check if the user is verified
    if (user.isVerified !== true) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    //check session is already exist or delete the existing session
    const existingSession = await sessionModel.findOne({ userId: user._id });
    if (existingSession) {
      await sessionModel.deleteOne({ userId: user._id });
    }
    // Create a new session for the user
    const newSession = await sessionModel.create({
      userId: user._id,
    });

    // Generate a new token for the user
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        token: user.token,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogout = async (req, res) => {
  try {
    const authHeader  = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Access token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const userId = decoded.id;
 
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Delete the user's session
    await sessionModel.deleteMany({ userId: user._id });

    // Mark the user as logged out
    user.isLoggedIn = false;
    await user.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }
    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save the OTP and its expiration time to the user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the OTP to the user's email
    await sendOtpEmail(user.email, otp);
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error forgetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email; // Assuming the email is passed as a URL parameter

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the OTP is valid
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if the OTP has expired
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email; // Assuming the email is passed as a URL parameter

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export default {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  userLogin,
  userLogout,
  forgetPassword,
  verifyOtp,
  changePassword,
};
