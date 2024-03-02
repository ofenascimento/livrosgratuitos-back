const emailTemplate = (token) => `
<table width="100%" bgcolor="#F1F5F8" border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td>
            <table align="center" bgcolor="#fff" style="width: 600px; margin: 0 auto; border-collapse: collapse; padding: 40px; border: 10px solid #F1F5F8;">
                <tr>
                    <td style="text-align: center; padding: 20px;">
                        <img src="https://livrosgratuitos.s3.sa-east-1.amazonaws.com/assets/logo-email.png" alt="Cabeçalho" style="max-width:80%; height:auto;">
                        <h1 style="color: #333;">Recuperação de Senha</h1>
                        <p style="color: #000; font-size: 16px;">Seu token de recuperação de senha é:</p>
                        <h1 style="color: #7b66ff;">${token}</h1>
                        <p style="color: #000; font-style: italic;">(Válido por 10 minutos)</p>
                        <p style="color: #000;">Use este código no aplicativo para criar uma nova senha.</p>
                        <br>
                        <p style="color: #666; font-size: 14px; margin-right: 6px;">Se tiver dúvida, entre em contato:
                            <a href="mailto:contato@livrosgratuitos.com" style="color: #007BFF; font-size: 14px; text-decoration: underline;">contato@livrosgratuitos.com</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`;

module.exports = emailTemplate;
