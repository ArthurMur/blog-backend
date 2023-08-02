import express from 'express'
import mongoose from 'mongoose';
import {registerValidation} from '../validations/auth.js'
import checkAuth from '../utils/checkAuth.js'
import * as UserController from '../controllers/UserController.js'

// Подключение к базе данных
mongoose
.connect('mongodb+srv://Arthur:TeamSESH2281337@cluster0.0ylbds4.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('MD OK!'))
.catch(err => console.log('DB error', err));

const app = express(); // Создаем экземпляр приложения Express, это объект для настройки нашего сервера и определения маршрутов и обработчиков запросов

app.use(express.json()); // Проверяем тело запроса (request body) на наличие данных в формате JSON и преобразуем их в JavaScript объект.

app.post('/auth/login', UserController.login); // Авторизация пользователя
app.get('/auth/me', checkAuth, UserController.getMe); // Получение информации о пользователе
app.post('/auth/register', registerValidation, UserController.register); // Создание нового пользователя

app.listen(5173, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK!');
});
