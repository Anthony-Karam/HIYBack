// const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  // Create the transporter
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // construct the verification link
    const link = `http://localhost:3000/users/verify/${token}`;
    // Define the email options
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Account Verification",
      html: `<p>Please click on the following link to verify your account:</p>
              <a href="${link}">${link}</a>`,
    });
    console.log("Verification email sent: %s", info.messageId);
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};
module.exports = sendEmail;
