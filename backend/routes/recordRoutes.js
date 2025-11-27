const express = require('express');
const router = express.Router();
const {
  createRecord,
  getMyRecords,
  getAllRecords,
  getRecordById,
  getRecordsByUserId,
  updateRecord,
  deleteRecord,
  getHealthStats,
} = require('../controllers/recordController');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRecord).get(protect, getMyRecords);
router.route('/all').get(protect, admin, getAllRecords);
router.route('/stats/summary').get(protect, getHealthStats);
router.route('/user/:userId').get(protect, doctor, getRecordsByUserId);
router.route('/:id').get(protect, getRecordById).put(protect, updateRecord).delete(protect, deleteRecord);

module.exports = router;
