const express = require('express');
const router = express.Router();
const {
  getDoctorSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAvailableSlots,
  applyLeave,
  getMyLeaves,
  deleteLeave,
  getAllLeaves,
  reviewLeave,
} = require('../controllers/scheduleController');
const { protect, doctor, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/doctor/:doctorId', getDoctorSchedule);
router.get('/available-slots/:doctorId/:date', getAvailableSlots);

// Protected routes - Doctor only
router.post('/', protect, doctor, createSchedule);
router.put('/:id', protect, doctor, updateSchedule);
router.delete('/:id', protect, doctor, deleteSchedule);

// Leave management - Doctor
router.post('/leave', protect, doctor, applyLeave);
router.get('/leaves', protect, doctor, getMyLeaves);
router.delete('/leave/:id', protect, doctor, deleteLeave);

// Leave management - Admin
router.get('/leaves/all', protect, admin, getAllLeaves);
router.put('/leaves/:id/review', protect, admin, reviewLeave);

module.exports = router;
