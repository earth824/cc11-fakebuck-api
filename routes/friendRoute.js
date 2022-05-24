const express = require('express');
const friendController = require('../controllers/friendController');

const router = express.Router();

router.post('/', friendController.requestFriend);
router.patch('/:requestFromId', friendController.updateFriend);
router.delete('/:id', friendController.deleteFriend);

module.exports = router;