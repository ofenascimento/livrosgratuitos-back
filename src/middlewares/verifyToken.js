const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if(!bearerHeader) {
        return res.status(401).send('Acesso negado. Nenhum token fornecido.')
    }

    const token = bearerHeader.split(' ')[1]

    if (!token) return res.status(401).send('Acesso negado. Nenhum token fornecido.');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Token inválido.');
    }
}

module.exports = verifyToken;