const jwt = require('jsonwebtoken');

const SECRET_KEY = "token"; 
const payload = {
    user_id: "usuarioTeste"
};

const options = {
    expiresIn: '2h', 
};

const token = jwt.sign(payload, SECRET_KEY, options);

console.log("Token gerado:", token);
