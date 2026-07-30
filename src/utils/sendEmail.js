const nodemailer = require('nodemailer');
const emailTemplate = require('../utils/emailTemplate');
const logger = require('../utils/logger');

async function sendEmail(to, subject, token) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: emailTemplate(token),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error({ err: error, to }, 'Erro ao enviar e-mail');
  }
}

module.exports = sendEmail;