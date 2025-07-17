import Logger from '../utils/logger.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      Logger.warn('Validation error:', error.details[0].message);
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.details[0].message 
      });
    }
    next();
  };
};

export const sanitizeInput = (req, res, next) => {
  // Basic sanitization
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  next();
};