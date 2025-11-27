const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

router.route('/').post(protect, createAppointment).get(protect, admin, getAllAppointments);
router.route('/my-appointments').get(protect, getMyAppointments);
router.route('/doctor-appointments').get(protect, doctor, getDoctorAppointments);
router.route('/:id/status').put(protect, doctor, updateAppointmentStatus);
router.route('/:id/cancel').put(protect, cancelAppointment);
router
  .route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, admin, updateAppointment)
  .delete(protect, admin, deleteAppointment);

module.exports = router;
