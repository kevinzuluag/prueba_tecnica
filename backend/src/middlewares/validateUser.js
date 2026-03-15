import { body, validationResult } from 'express-validator';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneDigitsOnly = (val) => (val || '').replace(/\D/g, '');
const phoneRegex = /^\+\d{1,4}[\s\d]*$/;

export const validateUserCreate = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email no es válido')
    .matches(emailRegex)
    .withMessage('Formato de email inválido'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .custom((value) => {
      if (!value || !value.trim()) return true;
      const trimmed = value.trim();
      if (!phoneRegex.test(trimmed)) {
        throw new Error('El teléfono debe empezar por código de país (+XX) y contener solo dígitos y espacios.');
      }
      const digits = phoneDigitsOnly(trimmed);
      if (digits.length < 8 || digits.length > 15) {
        throw new Error('El número debe tener entre 8 y 15 dígitos (código de país + número).');
      }
      return true;
    }),
  body('city').optional().trim(),
  body('country').optional().trim(),
  body('company').optional().trim(),
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({ error: messages.join('. ') });
  }
  next();
}
