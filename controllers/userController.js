const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { User } = require('../models');
const FriendService = require('../services/friendService');

exports.getMe = async (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user));
  const friends = await FriendService.findAcceptedFriend(req.user.id);
  user.friends = friends;

  res.json({ user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (error) {
        return next(error);
      }

      await User.update(
        { profilePic: result.secure_url },
        { where: { id: req.user.id } }
      );

      fs.unlinkSync(req.file.path);

      res.json({ profilePic: result.secure_url });
    });
  } catch (err) {
    next(err);
  }
};
