function verifyUser(req, res, next) {
    const user = req.user;
    const userId = req.params.userId;

    if (user._id !== userId) {
        return res.status(403).send('Acesso negado.');
    }

    next();
}

module.exports = verifyUser;