import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recordsAPI, appointmentsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecordForm from '../components/RecordForm';
import ChartCard from '../components/ChartCard';
import AIAdviceBox from '../components/AIAdviceBox';
import {
  Activity,
  Droplet,
  Weight,
  Heart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchRecords();
    fetchStats();
    fetchUpcomingAppointments();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await recordsAPI.getMy();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await recordsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const { data } = await appointmentsAPI.getMyAppointments();

      // First, check if there's a doctor-scheduled next visit
      const nextVisit = data.find(apt => apt.nextVisitDate && new Date(apt.nextVisitDate) >= new Date());

      // Get regular upcoming appointments
      const upcoming = data.filter(apt =>
        new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
      ).slice(0, 3);

      // If there's a next visit scheduled by doctor, add it to the top
      if (nextVisit && !upcoming.find(apt => apt._id === nextVisit._id)) {
        setAppointments([nextVisit, ...upcoming.slice(0, 2)]);
      } else {
        setAppointments(upcoming);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleRecordAdded = () => {
    fetchRecords();
    fetchStats();
    setShowForm(false);
  };

  // Health Status Analysis
  const getHealthStatus = () => {
    if (!stats?.latestRecord) return null;

    const { bloodPressure, sugarLevel } = stats.latestRecord;
    let bpStatus = 'normal';
    let sugarStatus = 'normal';

    if (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) {
      bpStatus = 'high';
    } else if (bloodPressure.systolic < 90 || bloodPressure.diastolic < 60) {
      bpStatus = 'low';
    }

    if (sugarLevel > 125) {
      sugarStatus = 'high';
    } else if (sugarLevel < 70) {
      sugarStatus = 'low';
    }

    return { bpStatus, sugarStatus };
  };

  const healthStatus = getHealthStatus();

  // Prepare chart data
  const bpData = records.map((r) => ({
    date: r.date,
    value: r.bloodPressure.systolic,
  })).reverse();

  const sugarData = records.map((r) => ({
    date: r.date,
    value: r.sugarLevel,
  })).reverse();

  const weightData = records.map((r) => ({
    date: r.date,
    value: r.weight,
  })).reverse();

  const heartRateData = records
    .filter((r) => r.heartRate)
    .map((r) => ({
      date: r.date,
      value: r.heartRate,
    })).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 mt-16 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">

            {/* Professional Header */}
            <div className="mb-8 bg-gradient-to-r from-primary-600 to-medical text-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="text-primary-100 text-lg">
                    Your Health Dashboard - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="hidden md:block">
                  <Zap className="h-20 w-20 text-white opacity-50" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setShowForm(!showForm)}
                className="card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-90">Quick Action</p>
                    <p className="text-xl font-bold mt-1">Add Health Record</p>
                  </div>
                  <Activity className="h-12 w-12 opacity-80" />
                </div>
              </button>

              <a href="/appointments" className="card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-90">Book Now</p>
                    <p className="text-xl font-bold mt-1">New Appointment</p>
                  </div>
                  <Calendar className="h-12 w-12 opacity-80" />
                </div>
              </a>

              <div className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium opacity-90">Next Visit</p>
                    <p className="text-xl font-bold mt-1">
                      {appointments.length > 0 && appointments[0].nextVisitDate ?
                        new Date(appointments[0].nextVisitDate).toLocaleDateString() :
                        appointments.length > 0 ?
                        new Date(appointments[0].date).toLocaleDateString() :
                        'No upcoming'}
                    </p>
                    {appointments.length > 0 && appointments[0].nextVisitDate && appointments[0].nextVisitReason && (
                      <p className="text-xs opacity-75 mt-1">📋 {appointments[0].nextVisitReason}</p>
                    )}
                  </div>
                  <Clock className="h-12 w-12 opacity-80" />
                </div>
              </div>
            </div>

            {/* Health Status Banner */}
            {healthStatus && (
              <div className={`card mb-8 ${
                healthStatus.bpStatus === 'high' || healthStatus.sugarStatus === 'high'
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : 'bg-green-50 border-l-4 border-green-500'
              }`}>
                <div className="flex items-start space-x-4">
                  {healthStatus.bpStatus === 'high' || healthStatus.sugarStatus === 'high' ? (
                    <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {healthStatus.bpStatus === 'high' || healthStatus.sugarStatus === 'high'
                        ? '⚠️ Health Alert'
                        : '✅ Health Status: Good'}
                    </h3>
                    <p className="text-gray-700">
                      {healthStatus.bpStatus === 'high' && 'Your blood pressure is elevated. '}
                      {healthStatus.sugarStatus === 'high' && 'Your blood sugar is high. '}
                      {healthStatus.bpStatus === 'normal' && healthStatus.sugarStatus === 'normal'
                        ? 'Your vital signs are within normal ranges. Keep up the good work!'
                        : 'Consider consulting with your doctor soon.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards with Trends */}
            {stats?.averages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-red-50 via-white to-red-50 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Blood Pressure</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stats.averages.bloodPressure.systolic}/{stats.averages.bloodPressure.diastolic}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">mmHg (Average)</p>
                    </div>
                    <Activity className="h-16 w-16 text-red-500 opacity-20" />
                  </div>
                  <div className="flex items-center text-sm">
                    {stats.latestRecord?.bloodPressure.systolic <= 120 ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600 font-medium">Normal Range</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-600 font-medium">Above Normal</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-50 via-white to-blue-50 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Blood Sugar</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stats.averages.sugarLevel}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">mg/dL (Average)</p>
                    </div>
                    <Droplet className="h-16 w-16 text-blue-500 opacity-20" />
                  </div>
                  <div className="flex items-center text-sm">
                    {stats.latestRecord?.sugarLevel <= 125 ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-600 font-medium">Normal Range</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-600 font-medium">Above Normal</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 via-white to-green-50 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Body Weight</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stats.averages.weight}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">kg (Average)</p>
                    </div>
                    <Weight className="h-16 w-16 text-green-500 opacity-20" />
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">Target Range</span>
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-50 via-white to-purple-50 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Health Records</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stats.totalRecords}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Total Entries</p>
                    </div>
                    <Heart className="h-16 w-16 text-purple-500 opacity-20" />
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-600 font-medium">
                      {stats.totalRecords > 0 ? 'Tracking Active' : 'Start Tracking'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State with Professional CTA */
              <div className="card mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
                <div className="text-center py-12">
                  <Activity className="h-24 w-24 text-blue-500 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Start Your Health Journey Today!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Track your vital signs, receive AI-powered health insights, and take control of your wellbeing.
                    Add your first health record to unlock personalized recommendations.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Add Your First Health Record
                  </button>
                </div>
              </div>
            )}

            {/* AI Advice for Latest Record */}
            {records[0]?.aiAdvice && (
              <div className="mb-8">
                <AIAdviceBox advice={records[0].aiAdvice} />
              </div>
            )}

            {/* Record Form (Collapsible) */}
            {showForm && (
              <div className="mb-8 animate-fadeIn">
                <RecordForm onSuccess={handleRecordAdded} />
              </div>
            )}

            {/* Upcoming Appointments */}
            {appointments.length > 0 && (
              <div className="card mb-8">
                <h2 className="card-header flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-primary-600" />
                  Upcoming Appointments
                </h2>
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-500 text-white rounded-lg p-3">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Dr. {apt.doctorId?.userId?.name || 'Doctor'}
                          </p>
                          <p className="text-sm text-gray-600">{apt.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {new Date(apt.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts with Professional Design */}
            {records.length > 0 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-primary-600" />
                    Health Trends & Analytics
                  </h2>
                  <p className="text-gray-600 mt-1">Visual representation of your health metrics over time</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <ChartCard
                    title="Blood Pressure Trend (Systolic)"
                    data={bpData}
                    label="Systolic BP (mmHg)"
                    color="#ef4444"
                  />
                  <ChartCard
                    title="Blood Sugar Level Trend"
                    data={sugarData}
                    label="Sugar Level (mg/dL)"
                    color="#3b82f6"
                  />
                  <ChartCard
                    title="Body Weight Trend"
                    data={weightData}
                    label="Weight (kg)"
                    color="#10b981"
                  />
                  {heartRateData.length > 0 && (
                    <ChartCard
                      title="Heart Rate Monitoring"
                      data={heartRateData}
                      label="Heart Rate (bpm)"
                      color="#8b5cf6"
                    />
                  )}
                </div>
              </>
            )}

            {/* Recent Records with Enhanced Table */}
            <div className="card">
              <h2 className="card-header flex items-center justify-between">
                <span className="flex items-center">
                  <Activity className="h-6 w-6 mr-2 text-primary-600" />
                  Recent Health Records
                </span>
                <span className="text-sm font-normal text-gray-500">
                  Last {records.length > 10 ? '10' : records.length} entries
                </span>
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading your health records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">
                    No health records yet. Start tracking your health today!
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Record
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Blood Pressure
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Sugar Level
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Heart Rate
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.slice(0, 10).map((record, index) => (
                        <tr key={record._id} className={`hover:bg-blue-50 transition-colors ${index === 0 ? 'bg-blue-50/50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index === 0 && (
                                <span className="mr-2 px-2 py-1 text-xs font-bold bg-primary-600 text-white rounded">
                                  LATEST
                                </span>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(record.date).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(record.date).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${
                              record.bloodPressure.systolic > 140 ? 'text-red-600' :
                              record.bloodPressure.systolic < 90 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                            </span>
                            <div className="text-xs text-gray-500">mmHg</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${
                              record.sugarLevel > 125 ? 'text-red-600' :
                              record.sugarLevel < 70 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {record.sugarLevel}
                            </span>
                            <div className="text-xs text-gray-500">mg/dL</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {record.weight}
                            </span>
                            <div className="text-xs text-gray-500">kg</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.heartRate ? (
                              <>
                                <span className="text-sm font-semibold text-gray-900">
                                  {record.heartRate}
                                </span>
                                <div className="text-xs text-gray-500">bpm</div>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">Not recorded</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {record.note || <span className="text-gray-400 italic">No notes</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Health Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-green-600" />
                  Stay Active
                </h3>
                <p className="text-sm text-gray-700">
                  Aim for at least 30 minutes of moderate exercise daily to maintain cardiovascular health.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <Droplet className="h-5 w-5 mr-2 text-blue-600" />
                  Stay Hydrated
                </h3>
                <p className="text-sm text-gray-700">
                  Drink 8-10 glasses of water daily. Proper hydration supports overall health and wellbeing.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  Regular Checkups
                </h3>
                <p className="text-sm text-gray-700">
                  Schedule regular health screenings and follow up with your healthcare provider.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
