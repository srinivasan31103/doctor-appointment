const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private
const createDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      availableSlots,
      hospital,
      address,
    } = req.body;

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId: req.user._id });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      userId: req.user._id,
      specialization,
      qualification,
      experience,
      consultationFee,
      availableSlots,
      hospital,
      address,
    });

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
      'userId',
      'name email phone'
    );

    res.status(201).json(populatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true }).populate(
      'userId',
      'name email phone'
    );
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'name email phone age gender'
    );

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by user ID
// @route   GET /api/doctors/user/:userId
// @access  Private
const getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId }).populate(
      'userId',
      'name email phone'
    );

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if user owns this doctor profile
    if (doctor.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (doctor) {
      await doctor.deleteOne();
      res.json({ message: 'Doctor profile removed' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search doctors by specialization
// @route   GET /api/doctors/search/:specialization
// @access  Public
const searchDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      specialization: { $regex: req.params.specialization, $options: 'i' },
      isAvailable: true,
    }).populate('userId', 'name email phone');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoctorProfile,
  getDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateDoctorProfile,
  deleteDoctorProfile,
  searchDoctorsBySpecialization,
};
