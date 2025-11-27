const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide appointment date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide appointment time'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason for appointment'],
    },
    symptoms: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    nextVisitDate: {
      type: Date,
      default: null,
    },
    nextVisitReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
