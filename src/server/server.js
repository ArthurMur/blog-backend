import express from 'express'
import mongoose from 'mongoose';
import {registerValidation, loginValidation, postCreateValidation} from '../validations/validations.js'
import checkAuth from '../utils/checkAuth.js'
import * as UserController from '../controllers/UserController.js'
import * as PostController from '../controllers/PostController.js'

// Подключение к базе данных
mongoose
.connect('mongodb+srv://Arthur:TeamSESH2281337@cluster0.0ylbds4.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('MD OK!'))
.catch(err => console.log('DB error', err));

const app = express(); // Создаем экземпляр приложения Express, это объект для настройки нашего сервера и определения маршрутов и обработчиков запросов

app.use(express.json()); // Проверяем тело запроса (request body) на наличие данных в формате JSON и преобразуем их в JavaScript объект.

app.post('/auth/login', loginValidation, UserController.login); // Авторизация пользователя
app.get('/auth/me', checkAuth, UserController.getMe); // Получение информации о пользователе
app.post('/auth/register', registerValidation, UserController.register); // Создание нового пользователя
app.post('/posts', checkAuth, postCreateValidation, PostController.create); // Создание поста
app.get('/posts', PostController.getPosts); // Получение всех постов
app.get('/posts/:id', PostController.getOne); // Получение id поста
app.delete('/posts/:id', checkAuth, PostController.remove); // Удаление поста

app.listen(5173, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK!');
});
