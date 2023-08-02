import { body } from 'express-validator';

export const loginValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('fullName','Укажите имя').isLength({ min: 3 }),
    body('avatarUrl','Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title','Необходимо указать название статьи').isLength({ min: 3 }).isString(),
    body('text','Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags','Неверный формат тегов (укажите массив)').optional().isString(),
    body('inageUrl','Неверная ссылка на изображение').optional().isString(),
];