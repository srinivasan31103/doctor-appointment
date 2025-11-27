const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Record = require('../models/recordModel');

// @desc    Get monthly statistics
// @route   GET /api/analytics/monthly
// @access  Private (Admin)
const getMonthlyStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), months = 12 } = req.query;

    // Get monthly appointment stats
    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Get monthly user registrations
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Get monthly health records
    const recordStats = await Record.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Format data for frontend
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let month = 1; month <= 12; month++) {
      const appointmentsByStatus = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        rejected: 0
      };

      appointmentStats.forEach(stat => {
        if (stat._id.month === month) {
          appointmentsByStatus[stat._id.status] = stat.count;
        }
      });

      const usersByRole = {
        user: 0,
        doctor: 0,
        admin: 0
      };

      userStats.forEach(stat => {
        if (stat._id.month === month) {
          usersByRole[stat._id.role] = stat.count;
        }
      });

      const records = recordStats.find(stat => stat._id.month === month)?.count || 0;

      monthlyData.push({
        month: monthNames[month - 1],
        monthNumber: month,
        year: parseInt(year),
        appointments: appointmentsByStatus,
        totalAppointments: Object.values(appointmentsByStatus).reduce((a, b) => a + b, 0),
        users: usersByRole,
        totalUsers: Object.values(usersByRole).reduce((a, b) => a + b, 0),
        healthRecords: records
      });
    }

    // Calculate appointment status summary
    const appointmentsByStatus = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0
    };

    monthlyData.forEach(month => {
      Object.keys(month.appointments).forEach(status => {
        appointmentsByStatus[status] += month.appointments[status];
      });
    });

    res.json({
      year: parseInt(year),
      data: monthlyData,
      summary: {
        totalAppointments: monthlyData.reduce((sum, m) => sum + m.totalAppointments, 0),
        totalUsers: monthlyData.reduce((sum, m) => sum + m.totalUsers, 0),
        totalHealthRecords: monthlyData.reduce((sum, m) => sum + m.healthRecords, 0),
        appointmentsByStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor performance by month
// @route   GET /api/analytics/doctor-performance
// @access  Private (Admin, Doctor)
const getDoctorPerformance = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), doctorId } = req.query;

    const matchQuery = {
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    };

    // If doctorId provided, filter by that doctor
    if (doctorId) {
      matchQuery.doctorId = require('mongoose').Types.ObjectId(doctorId);
    }

    const performanceStats = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor.userId',
          foreignField: '_id',
          as: 'doctorUser'
        }
      },
      { $unwind: '$doctorUser' },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            doctorId: '$doctorId',
            doctorName: '$doctorUser.name',
            specialization: '$doctor.specialization'
          },
          totalAppointments: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.month': 1, totalAppointments: -1 }
      }
    ]);

    res.json(performanceStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue statistics by month
// @route   GET /api/analytics/revenue
// @access  Private (Admin)
const getRevenueStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          },
          status: { $in: ['completed', 'confirmed'] }
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalRevenue: { $sum: '$doctor.consultationFee' },
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyRevenue = monthNames.map((name, index) => {
      const stat = revenueStats.find(s => s._id.month === index + 1);
      return {
        month: name,
        monthNumber: index + 1,
        revenue: stat?.totalRevenue || 0,
        appointments: stat?.appointmentCount || 0
      };
    });

    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
    const totalAppointments = monthlyRevenue.reduce((sum, m) => sum + m.appointments, 0);

    res.json({
      year: parseInt(year),
      data: monthlyRevenue,
      summary: {
        totalRevenue,
        totalAppointments,
        averagePerAppointment: totalAppointments > 0 ? totalRevenue / totalAppointments : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMonthlyStats,
  getDoctorPerformance,
  getRevenueStats
};
