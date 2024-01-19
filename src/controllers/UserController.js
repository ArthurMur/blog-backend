import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js'

/* Обработчик маршрута POST '/auth/register'. Регистрация пользователя. registerValidation - функция промежуточной обработки (middleware),
 которая выполняет валидацию данных, отправленных клиентом. req и res - это объекты представляющие запрос и ответ соответственно. */ 
export const register = async (req, res) => {
  try {
    
    const password = req.body.password; // Объявляется и инициализируется переменная password, которая получается из тела запроса (req.body)

    /* Создаем соли для хэширования пароля, используем bcrypt модуль для генерации соли.
    Соль - это случайная строка, которая добавляется к паролю перед хэшированием, чтобы усилить его безопасность. */
    const salt = await bcrypt.genSalt(10);

    /*Принимаем пароль и соль. Используем функцию bcrypt.hash для создания хеша пароля с использованием указанной соли.
    Дожидаемся завершения операции хеширования (await). Возвращаем хеш пароля и сохраняем его в переменную passwordHash.
    В переменной passwordHash будет храниться захешированный пароль*/
    const hash = await bcrypt.hash(password, salt);

  const doc = new UserModel({ // Создаем документ для создания пользователя
    email: req.body.email,
    passwordHash: hash,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,z
  });
  
  const user = await doc.save(); //Сохраняем пользователя в базу данных
  
  const token = jwt.sign({ _id: user._id }, "secret123", { expiresIn: '30d' }); // Создаем токен для авторизации

  const {passwordHash, ...userData} = user._doc; // Вытаскиваем passwordHash и не используем его
  
  res.json({...userData, token});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось создать пользователя', err });
    }
}

/* Обработчик маршрута GET '/auth/me'. Получение информацию о пользователe. */ 
export const login = async (req, res) => { 
  try {
    const user = await UserModel.findOne({ email: req.body.email }); // Получаем объект пользователя по его email

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // Проверяем пароль

    if (!isValidPass) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign({ _id: user._id }, "secret123", { expiresIn: '30d' }); // Создаем токен

    const {passwordHash, ...userData} = user._doc; // Вытаскиваем passwordHash и не используем его
  
    res.json({...userData, token})
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Не удалось авторизоваться', err });
    }
}

export const getMe = async (req, res) => { //
  try {
    const user = await UserModel.findById(req.userId); // Получаем объект пользователя по его _id
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const {passwordHash, ...userData} = user._doc; // Вытаскиваем passwordHash и не используем его
  
    res.json(userData);
  } catch (err) {
    console.log(err);
  }
}