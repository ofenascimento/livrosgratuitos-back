const nodemailer = require('nodemailer');

async function sendEmail( to, subject, text ) {
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
        text: text, 
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ' + info.response);
    } catch (error) {
        console.log('Erro ao enviar e-mail:', error);
    }
}

module.exports = sendEmail;
