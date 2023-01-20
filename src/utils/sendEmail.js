// const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendEmail = async (email, token, userName) => {
  // Create the transporter
  try {
    const transporter = nodemailer.createTransport({
      // service: process.env.SERVICE,
      host: process.env.SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // construct the verification link
    const link = `${process.env.URL}/users/verify/${token}`;
    // Define the email options
    const info = await transporter.sendMail({
      from: "info@hopeinyouth.com",
      to: email,
      subject: "Account Verification",
      html: `<h1>Hope In YOUth</h1>
      <h2>Hi ${userName},</h2>
      
      <h4>We're happy you signed up for Ring.<br>
      To start exploring Hope In Youth's courses,<br>
      please confirm your email address</h4>
      <button onclick=${link}>Verify Now </button><br>
      <h4>Welcome to Hope In Youth!</h4>
      <h5>HIY Team.</h5>`,
    });
    console.log("Verification email sent: %s", info.messageId);
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};
module.exports = sendEmail;
