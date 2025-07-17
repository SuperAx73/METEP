import jwt from 'jsonwebtoken';
import { auth } from '../config/firebase.js';
import { config } from '../config/environment.js';
import Logger from '../utils/logger.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    Logger.error('Error en autenticación:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const generateJWT = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};