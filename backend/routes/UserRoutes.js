const express = require('express');
const UserController = require('../controllers/UserController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();



// ✔ GIỮ LẠI các route của User
router.get('/me', protect, UserController.getMe);
router.patch('/change-password', protect, UserController.changePassword);
router.get('/:userId/name', UserController.getName);

module.exports = router;
