import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

export const sendMail = async <T extends string>(
  DESTINATION: T,
  SUBJECT: T,
  HTMLBODY: T,
  MESSAGE: T
) => {
  try {
    // Testing mail
    let testAccount = await nodemailer.createTestAccount();
    //etheral SMTP
    let Transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    //  sending real mail
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${EMAIL_USER}`, // ethereal user
        pass: `${EMAIL_PASS}`, // ethereal password
      },
    });
    // sending the mail
    const Mail = await transporter.sendMail({
      from: { name: "TechAdmin", address: `${EMAIL_USER}` },
      to: `${DESTINATION}`,
      subject: `${SUBJECT}`,
      text: `${MESSAGE}`,
      html: `${HTMLBODY}`,
    });

    return Mail;
  } catch (error) {
    throw createError.Unauthorized(`${error}`);
  }
};

// for using email in node with express fundamentally there are three key steps
// 1) creating a nodemailer Transporter like SMTP , AWS, GCS and a whole lot more
// 2) providing the mail configuration object
// 3) using sendmail method from nodemailer to send the mail
