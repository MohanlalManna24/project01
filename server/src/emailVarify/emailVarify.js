import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const varifyEmail = async (token, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const verificationUrl = `${process.env.APP_URL || "http://localhost:4000"}/api/users/verify-email?token=${encodeURIComponent(token)}`;

  const mailconfig = {
    from: {
      name: "NoteApp",
      address: process.env.MAIL_USER,
    },
    replyTo: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Verify your email: ${verificationUrl}`,
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your email</title>
        </head>
        <body style="margin:0; padding:0; background-color:#eef4f3; font-family:Arial, Helvetica, sans-serif; color:#173b3f;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#eef4f3; padding:40px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px; background-color:#ffffff; border:1px solid #d9e7e5; border-radius:12px; overflow:hidden;">
                  <tr>
                    <td style="background-color:#173b3f; padding:28px 32px; text-align:center;">
                      <div style="font-size:14px; font-weight:bold; letter-spacing:1.5px; color:#a8e6d8; text-transform:uppercase;">NoteApp</div>
                      <h1 style="margin:12px 0 0; font-size:28px; line-height:1.25; color:#ffffff;">Confirm your email</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:36px 32px 32px;">
                      <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Thanks for signing up. Please verify your email address to activate your account.</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0;">
                        <tr>
                          <td align="center">
                            <a href="${verificationUrl}" style="display:inline-block; padding:14px 28px; background-color:#1f8a70; border-radius:7px; color:#ffffff; font-size:16px; font-weight:bold; text-decoration:none;">Verify my email</a>
                          </td>
                        </tr>
                      </table>
                      <hr style="margin:28px 0 20px; border:0; border-top:1px solid #e3eceb;" />
                      <p style="margin:0; font-size:12px; line-height:1.6; color:#7a8d8f;">For your security, do not share this link. If you did not create an account, you can safely ignore this email.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px; background-color:#f7faf9; text-align:center;">
                      <p style="margin:0; font-size:12px; color:#7a8d8f;">This is an automated message. Please do not reply.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
  };

  const info = await transporter.sendMail(mailconfig);

  if (!info.accepted?.includes(email)) {
    throw new Error(`Email was not accepted for recipient: ${email}`);
  }

  return info;
};
