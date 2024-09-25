import jwt from "jsonwebtoken";
import alumnos from "../controllers/alumnos.js";
import profesores from "../controllers/profesores.js";

export const verifyToken = async (req, res, next) => {
    const headerToken = req.headers['authorization'];

    // Verificar si el token está proporcionado
    if (!headerToken) {
        return res.status(400).json({ message: "Token necesario" });
    }

    // Verificar si el token está en el formato correcto
    const tokenParts = headerToken.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        return res.status(400).json({ message: "Formato del token no válido" });
    }

    const token = tokenParts[1];

    try {
        const secret = "Vamos Racing";
        const decoded = jwt.verify(token, secret);

        // Verificar si el token contiene un ID de usuario válido
        const id = decoded.id;
        
        // Intentar encontrar al usuario como alumno
        let usuario = await alumnos.findById(id);
        
        // Si no se encuentra como alumno, intentar encontrar como profesor
        if (!usuario) {
            usuario = await profesores.findById(id);
        }

        if (!usuario) {
            return res.status(400).json({ message: "ID no válido" });
        }

        // Adjuntar el ID de usuario y el rol al objeto de la solicitud
        req.id = id;
        req.role = usuario.role; // Suponiendo que 'role' indica si el usuario es alumno o profesor
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token no válido o expirado" });
    }
};

export const verifyAdmin = async (req, res, next) => {
    const id = req.id;

    // Recuperar detalles del usuario para verificar si es un administrador (profesor)
    const usuario = await profesores.findById(id); // Solo verificar en profesores

    if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario es un administrador (profesor)
    if (usuario.role === 'admin') { // Suponiendo que el rol 'admin' está asignado a los profesores
        next();
    } else {
        return res.status(403).json({ message: "Acceso prohibido" });
    }
};
