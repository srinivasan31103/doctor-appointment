const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodPressure: {
      systolic: {
        type: Number,
        required: true,
        min: 0,
      },
      diastolic: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    sugarLevel: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    heartRate: {
      type: Number,
      min: 0,
    },
    temperature: {
      type: Number,
      min: 0,
    },
    note: {
      type: String,
      default: '',
    },
    aiAdvice: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Record', recordSchema);
