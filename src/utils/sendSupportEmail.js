const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

async function sendSupportEmail(userEmail, userName, subject, message) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_SUPPORT,
    subject: `Suporte LV: ${subject}`,
    html: `
        <table width="100%" bgcolor="#F1F5F8" border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td>
            <table align="center" bgcolor="#fff" style="width: 600px; margin: 0 auto; border-collapse: collapse; padding: 40px; border: 10px solid #F1F5F8;">
                <tr>
                    <td style="text-align: center; padding: 20px;">
                        <h1 style="color: #333;">${subject}</h1>
                        <p style="color: #000; font-size: 16px;">email ${userName}</p>
                        <p style="color: #000; font-size: 16px;">email ${userEmail}</p>
                        <p style="color: #000;">${message}</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ userEmail }, 'E-mail de suporte enviado com sucesso');
  } catch (error) {
    logger.error({ err: error, userEmail }, 'Erro ao enviar e-mail de suporte');
  }
}

module.exports = sendSupportEmail;