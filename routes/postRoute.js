const express = require('express');

const upload = require('../middlewares/upload');
const postController = require('../controllers/postController');

const router = express.Router();

router.post('/', upload.single('image'), postController.createPost);
router.post('/:postId/like', postController.createLike);

module.exports = router;
