import jwt from 'jsonwebtoken';
import { auth } from '../config/firebase.js';
import { config } from '../config/environment.js';
import Logger from '../utils/logger.js';

export const authenticateToken = async (req, res, next) => {
  try {
    Logger.info('Authenticating request for:', req.method, req.path);
    Logger.info('Headers:', JSON.stringify(req.headers));
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    Logger.info('Auth header present:', !!authHeader);
    Logger.info('Token present:', !!token);

    if (!token) {
      Logger.warn('No token provided');
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    // Verify Firebase token
    Logger.info('Verifying Firebase token...');
    const decodedToken = await auth.verifyIdToken(token);
    Logger.info('Token verified successfully for user:', decodedToken.uid);
    
    req.user = decodedToken;
    next();
  } catch (error) {
    Logger.error('Error en autenticación:', error);
    Logger.error('Error stack:', error.stack);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

export const generateJWT = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};