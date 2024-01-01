var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "eb95107c58adda",
    pass: "4e2c718133035b",
  },
});
module.exports = async (reciever, sub, message) => {
  let mailOptions = {
    from: process.env.MAIL_AUTH_CREDENTIAL_USER,
    to: (reciever = reciever),
    subject: sub,
    html: message,
  };

  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent in Email: " + JSON.stringify(response));
    }
  });
};
