import { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const MonthlyAnalytics = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [monthlyResponse, revenueResponse] = await Promise.all([
        analyticsAPI.getMonthlyStats(selectedYear),
        analyticsAPI.getRevenueStats(selectedYear),
      ]);

      setMonthlyStats(monthlyResponse.data);
      setRevenueStats(revenueResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!monthlyStats || !revenueStats) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available for {selectedYear}
      </div>
    );
  }

  const { data: monthlyData, summary } = monthlyStats;
  const { data: revenueData, summary: revenueSummary } = revenueStats;

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Monthly Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance and trends over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Appointments</p>
              <p className="text-3xl font-bold mt-2">{summary?.totalAppointments || 0}</p>
            </div>
            <Activity className="h-10 w-10 text-blue-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">New Users</p>
              <p className="text-3xl font-bold mt-2">{summary?.totalUsers || 0}</p>
            </div>
            <Users className="h-10 w-10 text-green-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Health Records</p>
              <p className="text-3xl font-bold mt-2">{summary?.totalHealthRecords || 0}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">
                ${revenueSummary?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-orange-100" />
          </div>
        </div>
      </div>

      {/* Appointments Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Appointments Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAppointments"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total Appointments"
            />
            <Line
              type="monotone"
              dataKey="appointments.completed"
              stroke="#10b981"
              strokeWidth={2}
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="appointments.pending"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Pending"
            />
            <Line
              type="monotone"
              dataKey="appointments.cancelled"
              stroke="#ef4444"
              strokeWidth={2}
              name="Cancelled"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Users and Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Users Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Users by Month
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users.user" fill="#3b82f6" name="Patients" />
              <Bar dataKey="users.doctor" fill="#10b981" name="Doctors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointment Status Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Appointment Status Distribution ({selectedYear})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                {
                  name: 'Completed',
                  value: summary?.appointmentsByStatus?.completed || 0,
                },
                {
                  name: 'Pending',
                  value: summary?.appointmentsByStatus?.pending || 0,
                },
                {
                  name: 'Confirmed',
                  value: summary?.appointmentsByStatus?.confirmed || 0,
                },
                {
                  name: 'Cancelled',
                  value: summary?.appointmentsByStatus?.cancelled || 0,
                },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Data Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((month) => (
                <tr key={month.monthNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month} {month.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.totalAppointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(month.users.user || 0) + (month.users.doctor || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.healthRecords}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${revenueData[month.monthNumber - 1]?.revenue?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
