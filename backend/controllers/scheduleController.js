const Schedule = require('../models/scheduleModel');
const Leave = require('../models/leaveModel');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

// @desc    Get doctor's schedule
// @route   GET /api/schedule/doctor/:doctorId
// @access  Public
const getDoctorSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      doctorId: req.params.doctorId,
      isActive: true,
    }).sort({ dayOfWeek: 1, startTime: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor's schedule
// @route   POST /api/schedule
// @access  Private (Doctor)
const createSchedule = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, slotDuration } = req.body;

    // Get doctor ID from authenticated user
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const schedule = await Schedule.create({
      doctorId: doctor._id,
      dayOfWeek,
      startTime,
      endTime,
      slotDuration: slotDuration || 30,
    });

    res.status(201).json(schedule);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Schedule already exists for this time slot' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor's schedule
// @route   PUT /api/schedule/:id
// @access  Private (Doctor)
const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor's schedule
// @route   DELETE /api/schedule/:id
// @access  Private (Doctor)
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available time slots for a doctor on a specific date
// @route   GET /api/schedule/available-slots/:doctorId/:date
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if doctor is on leave
    const leave = await Leave.findOne({
      doctorId,
      startDate: { $lte: selectedDate },
      endDate: { $gte: selectedDate },
    });

    if (leave) {
      return res.json({
        available: false,
        reason: `Doctor is on ${leave.type} leave`,
        slots: [],
      });
    }

    // Get doctor's schedule for this day
    const schedules = await Schedule.find({
      doctorId,
      dayOfWeek,
      isActive: true,
    });

    if (schedules.length === 0) {
      return res.json({
        available: false,
        reason: 'Doctor is not available on this day',
        slots: [],
      });
    }

    // Get existing appointments for this date
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $nin: ['cancelled', 'rejected'] },
    });

    const bookedSlots = appointments.map((apt) => apt.time);

    // Generate available slots
    const availableSlots = [];

    schedules.forEach((schedule) => {
      const slots = generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        schedule.slotDuration
      );

      slots.forEach((slot) => {
        if (!bookedSlots.includes(slot)) {
          availableSlots.push(slot);
        }
      });
    });

    res.json({
      available: availableSlots.length > 0,
      date: date,
      dayOfWeek,
      slots: availableSlots.sort(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime, duration) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeSlot);

    currentMin += duration;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
};

// @desc    Apply for leave
// @route   POST /api/schedule/leave
// @access  Private (Doctor)
const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason, type } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const leave = await Leave.create({
      doctorId: doctor._id,
      startDate,
      endDate,
      reason,
      type,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's leaves
// @route   GET /api/schedule/leaves
// @access  Private (Doctor)
const getMyLeaves = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const leaves = await Leave.find({ doctorId: doctor._id }).sort({ startDate: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete leave
// @route   DELETE /api/schedule/leave/:id
// @access  Private (Doctor)
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    await leave.deleteOne();
    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leave requests (Admin only)
// @route   GET /api/schedule/leaves/all
// @access  Private (Admin)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('doctorId', 'userId specialization')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or reject leave request
// @route   PUT /api/schedule/leaves/:id/review
// @access  Private (Admin)
const reviewLeave = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    leave.reviewNotes = reviewNotes || '';

    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate('doctorId', 'userId specialization')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('reviewedBy', 'name email');

    res.json(populatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
