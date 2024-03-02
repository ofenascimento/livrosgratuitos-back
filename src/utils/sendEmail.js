const nodemailer = require('nodemailer');
const emailTemplate = require('../utils/emailTemplate');

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
        html: emailTemplate(token)
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Erro ao enviar e-mail:', error);
    }
}

module.exports = sendEmail;
