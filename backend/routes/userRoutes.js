const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  createUserByAdmin,
  updateUserByAdmin,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/').get(protect, admin, getUsers);
router.post('/create', protect, admin, createUserByAdmin);
router.route('/:id')
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUser);

module.exports = router;
