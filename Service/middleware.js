// middleware.js
const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: 'Yetkilendirme başarısız: Token eksik.' });
    }

    jwt.verify(token, 'gizliAnahtar', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Yetkilendirme başarısız: Geçersiz token.' });
        }
        req.user = decoded;
        next();
    });
}
module.exports = checkAuth;
