const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.authenticateJWT = (req, res, next) => {
    // const token = req.header('Authorization');
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).send('Access denied.');
    // console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};
