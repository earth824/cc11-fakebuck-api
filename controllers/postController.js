const fs = require('fs');
const createError = require('../utils/createError');
const cloudinary = require('../utils/cloudinary');
const { Post, Like, sequelize } = require('../models');

exports.createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title && !req.file) {
      createError('title or image is required', 400);
    }

    let image;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      image = result.secure_url;
    }

    const post = await Post.create({ title, image, userId: req.user.id });
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.createLike = async (req, res, next) => {
  const t = await sequelize.transaction(); // START TRANSACTION
  try {
    const { postId } = req.params;

    const existLike = await Like.findOne({
      where: {
        postId,
        userId: req.user.id
      }
    });

    if (existLike) {
      createError('you already liked this post', 400);
    }

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      createError('post not found', 400);
    }

    const like = await Like.create(
      {
        postId,
        userId: req.user.id
      },
      { transaction: t }
    );
    await post.increment({ like: 1 }, { transaction: t });
    await t.commit();

    res.json({ like });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
