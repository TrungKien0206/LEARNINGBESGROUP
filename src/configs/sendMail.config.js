// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const mailService = {
//   async sendMail({ emailFrom, emailTo, emailSubject, emailText }) {
//     const mailOptions = {
//       from: emailFrom || process.env.SMTP_USER,
//       to: emailTo,
//       subject: emailSubject,
//       text: emailText,
//     };
//     console.log("Sending email:", mailOptions);
//     return await transporter.sendMail(mailOptions);
//   },
// };
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const mailService = {
  async sendMail({ emailFrom, emailTo, emailSubject, emailText }) {
    const mailOptions = {
      from: emailFrom || `"Your App Name" <${process.env.SMTP_USER}>`,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    };
    console.log("Sending email:", mailOptions);
    return await transporter.sendMail(mailOptions);
  },
};
