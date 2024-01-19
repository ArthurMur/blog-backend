import PostModel from '../models/Post.js'

// Получить все посты
export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось получить посты' });
  }
};

// Получить все посты
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось получить теги' });
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
    ).populate('user');

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
    const doc = new PostModel(
      {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.replace(/\s/g, '').split(','),
      user: req.userId,
      }
    );

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

// Обновить пост
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.updateOne(
      { 
        _id: postId 
      }, 
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.replace(/\s/g, '').split(','),
        user: req.userId,
      }
      );

    if (!doc) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    res.json({ message: 'Пост обновлен' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не удалось обновить пост' });
  }
};
