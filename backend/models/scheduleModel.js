const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    slotDuration: {
      type: Number,
      default: 30, // minutes per appointment
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate schedules
scheduleSchema.index({ doctorId: 1, dayOfWeek: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
