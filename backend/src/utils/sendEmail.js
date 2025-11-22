import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text,
    html,
  };

  await sgMail.send(msg);
  console.log("Email sent ✔");
};
