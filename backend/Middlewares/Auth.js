const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    try {
        const token = auth.split(' ')[1]; // Assumes 'Bearer <token>'
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token data (including email, id) to request
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};

module.exports = ensureAuthenticated;
