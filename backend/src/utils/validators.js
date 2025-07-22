import Joi from 'joi';

export const studyValidationSchema = Joi.object({
  responsable: Joi.string().required().min(2).max(100),
  supervisor: Joi.string().required().min(2).max(100),
  linea: Joi.string().required().min(1).max(50),
  modelo: Joi.string().required().min(1).max(50),
  familia: Joi.string().required().min(1).max(50),
  piezasPorHora: Joi.number().required().min(1).max(10000),
  taktime: Joi.number().required().min(0.1).max(3600),
  tolerancia: Joi.number().required().min(0.01).max(60),
  categories: Joi.array().items(Joi.string()).optional().default([]),
  maquinas: Joi.array().items(Joi.string()).optional().default([])
});

export const studyUpdateValidationSchema = Joi.object({
  responsable: Joi.string().optional().min(2).max(100),
  supervisor: Joi.string().optional().min(2).max(100),
  linea: Joi.string().optional().min(1).max(50),
  modelo: Joi.string().optional().min(1).max(50),
  familia: Joi.string().optional().min(1).max(50),
  piezasPorHora: Joi.number().optional().min(1).max(10000),
  taktime: Joi.number().optional().min(0.1).max(3600),
  tolerancia: Joi.number().optional().min(0.01).max(60),
  categories: Joi.array().items(Joi.string()).optional().default([]),
  maquinas: Joi.array().items(Joi.string()).optional().default([])
});

export const recordValidationSchema = Joi.object({
  numeroMuestra: Joi.number().required().min(1),
  esMicroparo: Joi.boolean().required(),
  tiempoCiclo: Joi.number().required().min(0.01).max(3600),
  desviacion: Joi.number().required(),
  fecha: Joi.date().required(),
  hora: Joi.string().required(),
  horaInicioMicroparo: Joi.string().optional().allow(''),
  categoriaCausa: Joi.string().allow('').max(100),
  comentario: Joi.string().allow('').max(500)
});

export const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(100)
});