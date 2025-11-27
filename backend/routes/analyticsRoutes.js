const express = require('express');
const router = express.Router();
const {
  getMonthlyStats,
  getDoctorPerformance,
  getRevenueStats
} = require('../controllers/analyticsController');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

// Admin only routes
router.get('/monthly', protect, admin, getMonthlyStats);
router.get('/revenue', protect, admin, getRevenueStats);

// Admin and Doctor routes
router.get('/doctor-performance', protect, getDoctorPerformance);

module.exports = router;
