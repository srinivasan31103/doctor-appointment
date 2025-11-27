const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const { sendEmail } = require('../config/mailer');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, symptoms } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      reason,
      symptoms,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    // Find doctor profile for current user
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone age gender bloodGroup')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone age gender bloodGroup')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (
      appointment.patientId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'doctor' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, prescription, diagnosis, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update appointment
    appointment.status = status || appointment.status;
    if (prescription) appointment.prescription = prescription;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (notes) appointment.notes = notes;

    const updatedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns this appointment
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private/Admin
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { date, time, reason, symptoms, status } = req.body;

    // Update fields if provided
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (symptoms !== undefined) appointment.symptoms = symptoms;
    if (status) appointment.status = status;

    const updatedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      await appointment.deleteOne();
      res.json({ message: 'Appointment removed' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  updateAppointment,
  deleteAppointment,
};
