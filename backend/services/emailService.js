const nodemailer = require("nodemailer");

const sendMail = async ({ from, to, subject, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.zeptomail.in",
      port: 587,
      // secure: false,
      auth: {
        user: "Zoho-enczapikey PHtE6r0MR7vpjjYqpEAFs/KwEZH3ZIt6/utuflIUt4tFWPIAGU0ArNsim2O3qBcuUqZCHPHIwIJhtries+3WJmruMj1FVWqyqK3sx/VYSPOZsbq6x00cuV0af0feXITvetVq3CDVs9beNA==",
        pass: "PHtE6r0MR7vpjjYqpEAFs/KwEZH3ZIt6/utuflIUt4tFWPIAGU0ArNsim2O3qBcuUqZCHPHIwIJhtries+3WJmruMj1FVWqyqK3sx/VYSPOZsbq6x00cuV0af0feXITvetVq3CDVs9beNA==",
      },
    });

    let info = await transporter.sendMail({
      from: "legal.arunkumarassociates@gmail.com",
      to,
      subject,
      html,
    });

    return info;
  } catch (err) {
    console.log("send mail error", err);
  }
};

module.exports = sendMail;
