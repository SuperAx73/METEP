import Logger from '../utils/logger.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    Logger.info('Validating request body:', JSON.stringify(req.body));
    
    const { error } = schema.validate(req.body);
    if (error) {
      Logger.warn('Validation error:', error.details[0].message);
      Logger.warn('Validation details:', JSON.stringify(error.details));
      return res.status(400).json({ 
        error: 'Error de validación',
        details: error.details[0].message 
      });
    }
    
    Logger.info('Validation passed successfully');
    next();
  };
};

export const sanitizeInput = (req, res, next) => {
  Logger.info('Sanitizing input for:', req.method, req.path);
  Logger.info('Original body:', JSON.stringify(req.body));
  
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
  Logger.info('Sanitized body:', JSON.stringify(req.body));
  next();
};