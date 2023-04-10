import { body, query } from 'express-validator';

const validateCreateUser = [
  body('firstname').notEmpty().withMessage('Can not find firstname parameter'),
  body('lastname').notEmpty().withMessage('Can not find lastname parameter'),
  body('age')
    .notEmpty()
    .withMessage('Can not find age parameter')
    .bail()
    .isInt({ min: 1, max: 100 })
    .withMessage('must be 1 <= age <= 100'),
  body('coordinate')
    .notEmpty()
    .withMessage('Can not find corrdinate parameter')
    .bail()
    .matches(/^\d{3}:\d{3}$/)
    .withMessage('Wrong format xxx:yyy with 0 <= x,y <= 9'),
];

const validateUpdateUser = [
  body().custom((body) => {
    const allowKeys = ['firstname', 'lastname', 'age', 'coordinate'];
    for (const key of Object.keys(body)) {
      if (!allowKeys.includes(key)) {
        throw new Error(`Unknown property: ${key}`);
      }
    }
    return true;
  }),
  body('firstname').optional(),
  body('lastname').optional(),
  body('age')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('must be 1 <= age <= 100'),
  body('coordinate')
    .optional()
    .matches(/^\d{3}:\d{3}$/)
    .withMessage('Wrong format xxx:yyy with 0 <= x,y <= 9'),
];

const validateReadUsers = [
  query('id').notEmpty().withMessage('Can not find id parameter'),
];

const validateSearchUsers = [
  query('name')
    .notEmpty()
    .withMessage('Can not find name parameter')
    .bail()
    .toLowerCase(),
];

const validateLocateUsers = [
  query('userId').notEmpty().withMessage('Can not find userId parameter'),
  query('n')
    .notEmpty()
    .withMessage('Can not find n parameter')
    .bail()
    .isInt()
    .withMessage('n must be integer')
    .bail()
    .toInt(),
];

const validateUser = {
  validateCreateUser: validateCreateUser,
  validateUpdateUser: validateUpdateUser,
  validateLocateUsers: validateLocateUsers,
  validateReadUsers: validateReadUsers,
  validateSearchUsers: validateSearchUsers,
};

export default validateUser;
