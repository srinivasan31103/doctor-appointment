const express = require('express');
const router = express.Router();
const {
  createDoctorProfile,
  getDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateDoctorProfile,
  deleteDoctorProfile,
  searchDoctorsBySpecialization,
} = require('../controllers/doctorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createDoctorProfile).get(getDoctors);
router.route('/search/:specialization').get(searchDoctorsBySpecialization);
router.route('/user/:userId').get(protect, getDoctorByUserId);
router
  .route('/:id')
  .get(getDoctorById)
  .put(protect, updateDoctorProfile)
  .delete(protect, admin, deleteDoctorProfile);

module.exports = router;
