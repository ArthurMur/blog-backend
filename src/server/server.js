import express from 'express'
import mongoose from 'mongoose';
import multer from 'multer';
import {registerValidation, loginValidation, postCreateValidation, commentCreateValidation} from '../validations/validations.js'
import { UserController, PostController, CommentController } from '../controllers/index.js';
import  {handleValidationErrors, checkAuth} from '../utils/index.js';
import cors from 'cors';

mongoose  // Подключение к базе данных
.connect('mongodb+srv://Arthur:TeamSESH2281337@cluster0.0ylbds4.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('MD OK!'))
.catch(err => console.log('DB error', err));

const { PORT = 4444 } = process.env; // Достаем порт

const app = express(); // Создаем экземпляр приложения Express

const storage = multer.diskStorage(
  {
    // Определение места, куда сохранять загруженные файлы
    destination: (_, __, cb) => {
      // Передаем в колбэк (cb) null (ошибки нет) и строку с путем до директории "uploads"
      cb(null, 'uploads');
    },
    // Определение имени файла
    filename: (_, file, cb) => {
      // Передаем в колбэк (cb) null (ошибки нет) и оригинальное имя файла
      cb(null, file.originalname);
    },
  }
);

const upload = multer({storage});

app.use(express.json()); // Проверяем тело запроса (request body) на наличие данных в формате JSON и преобразуем их в JavaScript объект.
app.use(cors());
app.use('/upload', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login); // Авторизация пользователя
app.get('/auth/me', checkAuth, UserController.getMe); // Получение информации о пользователе
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register); // Создание нового пользователя
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create); // Создание поста
app.get('/posts', PostController.getPosts); // Получение всех постов
app.get('/posts/:id', PostController.getOne); // Получение id поста
app.delete('/posts/:id', checkAuth, PostController.remove); // Удаление поста
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update); // Обновление поста
app.get('/tags', PostController.getLastTags); // Получение всех тегов
app.get('/posts/tags', PostController.getLastTags); // Получение всех тегов
app.post('/comments', checkAuth, commentCreateValidation, CommentController.createComment);
app.get('/comments/:postId', checkAuth, commentCreateValidation, CommentController.getCommentsByPost);
app.delete('/comments/:commentId', checkAuth, commentCreateValidation, CommentController.deleteComment);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  // Отправка JSON-ответа с URL загруженного файлаz
  res.json({
    url: `/upload/${req.file.originalname}`,
  });
});


app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK!');
});
