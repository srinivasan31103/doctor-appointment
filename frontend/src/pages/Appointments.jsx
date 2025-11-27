import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AppointmentForm from '../components/AppointmentForm';
import { Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, Video } from 'lucide-react';

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await appointmentsAPI.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentsAPI.cancel(id);
      fetchAppointments();
    } catch (error) {
      alert('Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertCircle className="h-4 w-4" />,
      },
      confirmed: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-4 w-4" />,
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-4 w-4" />,
      },
      completed: {
        color: 'bg-blue-100 text-blue-800',
        icon: <CheckCircle className="h-4 w-4" />,
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800',
        icon: <XCircle className="h-4 w-4" />,
      },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.icon}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-2">Manage your doctor appointments</p>
            </div>

            {/* Appointment Form */}
            <div className="mb-8">
              <AppointmentForm onSuccess={fetchAppointments} />
            </div>

            {/* Appointments List */}
            <div className="card">
              <h2 className="card-header">All Appointments</h2>
              {loading ? (
                <p className="text-gray-500">Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <p className="text-gray-500">
                  No appointments yet. Book your first appointment above!
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {appointment.doctorId?.userId?.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {appointment.doctorId?.specialization}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>

                          <div className="mb-2">
                            <p className="text-sm text-gray-700">
                              <strong>Reason:</strong> {appointment.reason}
                            </p>
                            {appointment.symptoms && (
                              <p className="text-sm text-gray-700">
                                <strong>Symptoms:</strong> {appointment.symptoms}
                              </p>
                            )}
                          </div>

                          {appointment.prescription && (
                            <div className="bg-blue-50 p-3 rounded-lg mt-3">
                              <p className="text-sm font-medium text-blue-900">Prescription:</p>
                              <p className="text-sm text-blue-800">{appointment.prescription}</p>
                            </div>
                          )}

                          {appointment.diagnosis && (
                            <div className="bg-green-50 p-3 rounded-lg mt-3">
                              <p className="text-sm font-medium text-green-900">Diagnosis:</p>
                              <p className="text-sm text-green-800">{appointment.diagnosis}</p>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col items-end space-y-2">
                          {getStatusBadge(appointment.status)}
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => navigate(`/video-call/${appointment._id}`)}
                              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              <Video className="h-4 w-4" />
                              <span>Join Consultation</span>
                            </button>
                          )}
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className="btn-danger text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appointments;
