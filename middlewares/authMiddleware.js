const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: ' Access Denied. No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;