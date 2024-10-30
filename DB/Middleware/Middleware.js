import jwt from "jsonwebtoken";
import alumnos from "../controllers/Alumnos.js";
import profesores from "../controllers/Profesores.js";


// Middleware para verificar el token
export const verifyToken = async (req, res, next) => {
    const headerToken = req.headers['authorization'];

    if (!headerToken) {
        return res.status(400).json({ message: "Token necesario" });
    }

    const tokenParts = headerToken.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        return res.status(400).json({ message: "Formato del token no válido" });
    }

    const token = tokenParts[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;
        req.role = decoded.role;

        next();
    } catch (error) {
        return res.status(500).json({ error: "Error al verificar token" });
    }
};
export const verifyAdmin = async (req, res, next) => {
    if (req.role !== 'profesor') {
        return res.status(403).json({ message: "Acceso prohibido, no eres administrador" });
    }
    next();
};