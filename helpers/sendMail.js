const nodemailer = require("nodemailer");
// const sgMail = require("@sendgrid/mail"); // SendGrid
// const { SENDGRID_API_KEY } = process.env; // SendGrid
// sgMail.setApiKey(SENDGRID_API_KEY); // SendGrid
const { META_EMAIL, META_PASS } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: { user: META_EMAIL, pass: META_PASS },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendMail = async (data) => {
  const mail = {
    ...data,
    from: META_EMAIL,
  };

  transport
    .sendMail(mail)
    .then(() => console.log("Mail sent successfully"))
    .catch((err) => console.log(err.message));

  // sgMail // SendGrid
  //   .send(mail) // SendGrid
  //   .then((data) => console.log(data)) // SendGrid
  //   .catch((err) => console.log(err)); // SendGrid
  return true;
};

module.exports = sendMail;
