import jwt from 'jsonwebtoken';

export default(req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
      try {
        const decoded = jwt.verify(token, "secret123"); // Расшифровываем токен
        req.userId = decoded._id; // Сохраняем идентификатор пользователя в req.userId (вшиваем, чтобы потом могли получить Id пользователя откуда угодно)
        next();
      } catch (e) {
        return res.status(403).json({ error: 'Нет доступа' });
      }
    } else {
      return res.status(403).json({ error: 'Нет доступа' });
    }
}