const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure you're using the environment variable
        req.user = decoded; // Save decoded user info into req.user
        next();
    } catch (error) {
        console.error('Invalid Token:', error);
        res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
