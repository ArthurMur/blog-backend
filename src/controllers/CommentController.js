import CommentModel from '../models/Comment.js'
import Post from '../models/Post.js';

// Создаем комментарий
export const createComment = async (req, res) => {
  try {
    const { text, post } = req.body;
    const doc = new CommentModel(
      { text, author: req.userId, post }
    );
    const comment = await doc.save();

    // Добавляем id комментария в массив комментариев поста
    await Post.findByIdAndUpdate(post, { $push: { comments: comment.id } });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получаем комментарии у поста
export const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await CommentModel.find({ post: postId }).populate('author');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удаляем комментарий
export const deleteComment = async (req, res) => {zz
  try {
    const commentId = req.params.commentId;
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    // Удаляем id комментария из массива комментариев поста
    await Post.findByIdAndUpdate(deletedComment.post, { $pull: { comments: commentId } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
