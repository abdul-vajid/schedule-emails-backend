import * as nodemailer from "nodemailer";
import moment from 'moment-timezone';


export const sendMail = (toEmail, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_SECURITY_PIN,
    },
  });
  return new Promise((resolve, reject) => {
    console.log("process.env.GMAIL_USERNAME", process.env.GMAIL_USERNAME)
    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: toEmail,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) reject(error);
      else resolve({ success: true, message: "Mail has been send successfully" });
    });
  });
}


export const verifyTime = async (scheduledAt) => {
  const currentISTTime = moment().tz("Asia/Kolkata");

  if (moment(scheduledAt).isBefore(currentISTTime)) {
    const error = new Error("ScheduledAt must be a future date");
    error.isVerificationError = true;

    throw error;
  }
  return
};

