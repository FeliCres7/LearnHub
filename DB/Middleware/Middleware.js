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

    console.log(tokenParts);

    const token = tokenParts[1];

    console.log(token)
    
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

      console.log(decoded)

        const {id} = decoded;
        
        
        const usuario = await pool.query('SELECT * FROM public."alumnos"', [id])
        
        if (!usuario) {
            usuario = await pool.query('SELECT * FROM public."profesores"',[id]);
        }

        if (!usuario) {
            return res.status(400).json({ message: "ID no válido" });
        }

        req.id = id;
        req.role = usuario;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token inválido." });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expirado." });
        } else {
            return res.status(500).json({ error: "Error interno del servidor." });
        }
    }
}

// Middleware para verificar si es administrador (rol de profesor)
export const verifyAdmin = async (req, res, next) => {
    try {
        const id = req.id;

      
        if (!id) {
            return res.status(400).json({ message: "ID no proporcionado" });
        }

       
        const usuario = await pool.query('SELECT * FROM public."profesores"',[id]);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar si el rol es 'admin'
        if (usuario.role === 'admin') { 
            next();
        } else {
            return res.status(403).json({ message: "Acceso prohibido, no eres administrador" });
        }
    } catch (error) {
        console.error(error); // Registrar el error
        return res.status(500).json({ message: "Error del servidor al verificar administrador" });
    }
};