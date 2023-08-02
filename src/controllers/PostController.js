import PostModel from '../models/Post.js'

// Получить все посты
export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось получить посты' });
  }
};
// Получить пост по id
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findOneAndUpdate(
      { _id: postId }, 
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    );

    if (!doc) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось получить посты' });
  }
};
// Создать новый пост
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось создать пост' });
  } 
}
// Удалить пост
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    res.json({ message: 'Пост удален' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось получить посты' });
  }
};
