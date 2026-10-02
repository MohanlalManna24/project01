import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailConfig = {
      from: {
        name: "NoteApp",
        address: process.env.MAIL_USER,
      },
      replyTo: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for NoteApp",
      text: `Your OTP is: ${otp}. This OTP is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailConfig);

};
