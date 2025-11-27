const Record = require('../models/recordModel');
const fetch = require('node-fetch');

// Helper function to get Claude AI advice
const getClaudeAdvice = async (bp, sugar, weight, heartRate, temperature) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `As a health advisor, provide a short, personalized health suggestion (max 100 words) based on these vital signs:
- Blood Pressure: ${bp.systolic}/${bp.diastolic} mmHg
- Blood Sugar: ${sugar} mg/dL
- Weight: ${weight} kg
${heartRate ? `- Heart Rate: ${heartRate} bpm` : ''}
${temperature ? `- Temperature: ${temperature}°F` : ''}

Give practical, actionable advice.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', response.statusText);
      return 'Unable to generate AI advice at this time. Please consult with a healthcare professional.';
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return 'Unable to generate AI advice at this time. Please consult with a healthcare professional.';
  }
};

// @desc    Create new health record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  try {
    const { bloodPressure, sugarLevel, weight, heartRate, temperature, note, date } = req.body;

    if (!bloodPressure || !sugarLevel || !weight) {
      return res.status(400).json({ message: 'Please provide all required health metrics' });
    }

    // Get AI advice from Claude
    let aiAdvice = '';
    if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your_claude_api_key_here') {
      aiAdvice = await getClaudeAdvice(bloodPressure, sugarLevel, weight, heartRate, temperature);
    } else {
      aiAdvice = 'AI advice is currently unavailable. Please add your Claude API key to enable this feature.';
    }

    const record = await Record.create({
      userId: req.user._id,
      bloodPressure,
      sugarLevel,
      weight,
      heartRate,
      temperature,
      note,
      date: date || Date.now(),
      aiAdvice,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user records
// @route   GET /api/records
// @access  Private
const getMyRecords = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all records (Admin only)
// @route   GET /api/records/all
// @access  Private/Admin
const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find({})
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Private
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate('userId', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check if user owns this record or is admin
    if (record.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get records by user ID (for doctors)
// @route   GET /api/records/user/:userId
// @access  Private/Doctor
const getRecordsByUserId = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update health record
// @route   PUT /api/records/:id
// @access  Private
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check if user owns this record
    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete health record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Check if user owns this record or is admin
    if (record.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get health statistics
// @route   GET /api/records/stats/summary
// @access  Private
const getHealthStats = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);

    if (records.length === 0) {
      return res.json({
        message: 'No records found',
        averages: null,
      });
    }

    // Calculate averages
    const totalRecords = records.length;
    const sums = records.reduce(
      (acc, record) => {
        acc.systolic += record.bloodPressure.systolic;
        acc.diastolic += record.bloodPressure.diastolic;
        acc.sugar += record.sugarLevel;
        acc.weight += record.weight;
        if (record.heartRate) acc.heartRate += record.heartRate;
        if (record.temperature) acc.temperature += record.temperature;
        return acc;
      },
      { systolic: 0, diastolic: 0, sugar: 0, weight: 0, heartRate: 0, temperature: 0 }
    );

    const stats = {
      totalRecords,
      latestRecord: records[0],
      averages: {
        bloodPressure: {
          systolic: Math.round(sums.systolic / totalRecords),
          diastolic: Math.round(sums.diastolic / totalRecords),
        },
        sugarLevel: Math.round(sums.sugar / totalRecords),
        weight: Math.round(sums.weight / totalRecords),
        heartRate: sums.heartRate ? Math.round(sums.heartRate / totalRecords) : null,
        temperature: sums.temperature ? Math.round(sums.temperature / totalRecords) : null,
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecord,
  getMyRecords,
  getAllRecords,
  getRecordById,
  getRecordsByUserId,
  updateRecord,
  deleteRecord,
  getHealthStats,
};
