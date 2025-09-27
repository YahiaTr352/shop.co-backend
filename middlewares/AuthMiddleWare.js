const jwt = require("jsonwebtoken");

const VerifyTokenAndRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(400).json({ message: "No token provided" });
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, "secretKey");

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
            }

            next();
        } catch (error) {
            res.status(400).json({ message: "Invalid token", error });
        }
    };
};

module.exports = VerifyTokenAndRole;
