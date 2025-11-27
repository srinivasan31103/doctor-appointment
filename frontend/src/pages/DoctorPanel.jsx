import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentsAPI, recordsAPI, scheduleAPI, doctorsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ScheduleManagement from '../components/ScheduleManagement';
import {
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle,
  XCircle,
  FileText,
  Video,
  Plus,
  Trash2,
  Edit,
  Save,
  X as CloseIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorPanel = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const navigate = useNavigate();
  const toast = useToast();

  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    prescription: '',
    diagnosis: '',
    notes: '',
    nextVisitDate: '',
    nextVisitReason: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update active tab when URL changes
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const fetchDoctorProfile = async () => {
    try {
      if (!user?._id) {
        console.log('No user ID found');
        return;
      }
      console.log('Fetching doctor profile for user ID:', user._id);
      const { data } = await doctorsAPI.getByUserId(user._id);
      console.log('Doctor profile loaded:', data);
      setDoctorProfile(data);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast.error('Failed to load doctor profile');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await appointmentsAPI.getDoctorAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDoctorProfile();
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const fetchPatientRecords = async (patientId) => {
    try {
      const { data } = await recordsAPI.getByUserId(patientId);
      setPatientRecords(data);
    } catch (error) {
      console.error('Error fetching patient records:', error);
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      status: appointment.status,
      prescription: appointment.prescription || '',
      diagnosis: appointment.diagnosis || '',
      notes: appointment.notes || '',
      nextVisitDate: appointment.nextVisitDate ? new Date(appointment.nextVisitDate).toISOString().split('T')[0] : '',
      nextVisitReason: appointment.nextVisitReason || '',
    });
    fetchPatientRecords(appointment.patientId._id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      await appointmentsAPI.updateStatus(selectedAppointment._id, formData);
      toast.success('Appointment updated successfully' +
        (formData.nextVisitDate ? '. Next visit scheduled for ' + new Date(formData.nextVisitDate).toLocaleDateString() : ''));
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 mt-16 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Doctor Panel</h1>
              <p className="text-gray-600 mt-2">Manage your appointments and patients</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {['overview', 'appointments', 'patients', 'schedule'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Overview Tab - Stats */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="card bg-gradient-to-br from-green-50 to-green-100">
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Appointments List */}
              <div className="card">
                <h2 className="card-header">Active Appointments</h2>
                {loading ? (
                  <p className="text-gray-500">Loading appointments...</p>
                ) : appointments.filter(apt => apt.status !== 'completed').length === 0 ? (
                  <p className="text-gray-500">No active appointments.</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {appointments.filter(apt => apt.status !== 'completed').map((appointment) => (
                      <div
                        key={appointment._id}
                        onClick={() => handleSelectAppointment(appointment)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedAppointment?._id === appointment._id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">
                              {appointment.patientId?.name}
                            </h3>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{appointment.time}</span>
                          </div>
                          <p>
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                        </div>
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/video-call/${appointment._id}`);
                            }}
                            className="mt-3 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <Video className="h-4 w-4" />
                            <span>Start Video Consultation</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Appointment Details & Update Form */}
              <div>
                {selectedAppointment ? (
                  <div className="space-y-6">
                    {/* Patient Info */}
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Patient Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Name:</strong> {selectedAppointment.patientId?.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedAppointment.patientId?.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedAppointment.patientId?.phone || 'N/A'}
                        </p>
                        <p>
                          <strong>Age:</strong> {selectedAppointment.patientId?.age || 'N/A'}
                        </p>
                        <p>
                          <strong>Blood Group:</strong>{' '}
                          {selectedAppointment.patientId?.bloodGroup || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Patient Health Records */}
                    {patientRecords.length > 0 && (
                      <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Recent Health Records
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {patientRecords.slice(0, 5).map((record) => (
                            <div key={record._id} className="border-l-4 border-primary-600 pl-3 py-2 bg-gray-50">
                              <p className="text-xs text-gray-500">
                                {new Date(record.date).toLocaleDateString()}
                              </p>
                              <div className="text-sm space-y-1">
                                <p>BP: {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}</p>
                                <p>Sugar: {record.sugarLevel} mg/dL</p>
                                <p>Weight: {record.weight} kg</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Update Form */}
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Update Appointment
                      </h3>
                      <form onSubmit={handleUpdateAppointment} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-field"
                            required
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prescription
                          </label>
                          <textarea
                            name="prescription"
                            value={formData.prescription}
                            onChange={handleChange}
                            rows="3"
                            className="input-field"
                            placeholder="Enter prescription details..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diagnosis
                          </label>
                          <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            rows="3"
                            className="input-field"
                            placeholder="Enter diagnosis..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="2"
                            className="input-field"
                            placeholder="Additional notes..."
                          />
                        </div>

                        {/* Next Visit Date Section */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                            Schedule Next Visit (Optional)
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Next Visit Date
                              </label>
                              <input
                                type="date"
                                name="nextVisitDate"
                                value={formData.nextVisitDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="input-field"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Next Visit
                              </label>
                              <input
                                type="text"
                                name="nextVisitReason"
                                value={formData.nextVisitReason}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Follow-up checkup"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button type="submit" className="btn-primary flex-1">
                            Update Appointment
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedAppointment(null)}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="card h-full flex items-center justify-center">
                    <p className="text-gray-500">Select an appointment to view details</p>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-semibold mb-4">My Patients</h2>
                  <p className="text-gray-600 mb-4">
                    View all patients you have consulted with
                  </p>

                  {loading ? (
                    <p className="text-gray-500">Loading patients...</p>
                  ) : appointments.length === 0 ? (
                    <p className="text-gray-500">No patients yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Get unique patients from appointments */}
                      {Array.from(new Map(
                        appointments
                          .filter(apt => apt.patientId)
                          .map(apt => [apt.patientId._id, apt.patientId])
                      ).values()).map((patient) => {
                        const patientAppointments = appointments.filter(
                          apt => apt.patientId?._id === patient._id
                        );
                        const completedCount = patientAppointments.filter(
                          apt => apt.status === 'completed'
                        ).length;
                        const lastVisit = patientAppointments
                          .filter(apt => apt.status === 'completed')
                          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                        return (
                          <div
                            key={patient._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                              setSelectedAppointment(patientAppointments[0]);
                              fetchPatientRecords(patient._id);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <User className="h-5 w-5 text-primary-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {patient.name}
                                  </h3>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Email:</span>{' '}
                                    {patient.email}
                                  </div>
                                  {patient.phone && (
                                    <div>
                                      <span className="font-medium">Phone:</span>{' '}
                                      {patient.phone}
                                    </div>
                                  )}
                                  {patient.age && (
                                    <div>
                                      <span className="font-medium">Age:</span> {patient.age}
                                    </div>
                                  )}
                                  {patient.bloodGroup && (
                                    <div>
                                      <span className="font-medium">Blood:</span>{' '}
                                      {patient.bloodGroup}
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3 flex items-center space-x-4 text-sm">
                                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                                    <span className="text-blue-700 font-medium">
                                      {patientAppointments.length} Total Appointments
                                    </span>
                                  </div>
                                  <div className="bg-green-50 px-3 py-1 rounded-full">
                                    <span className="text-green-700 font-medium">
                                      {completedCount} Completed
                                    </span>
                                  </div>
                                  {lastVisit && (
                                    <div className="text-gray-600">
                                      Last visit:{' '}
                                      {new Date(lastVisit.date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Patient Details Section */}
                {selectedAppointment && patientRecords.length > 0 && (
                  <div className="card">
                    <h2 className="text-lg font-semibold mb-4">
                      Health Records - {selectedAppointment.patientId?.name}
                    </h2>
                    <div className="space-y-4">
                      {patientRecords.map((record) => (
                        <div
                          key={record._id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-sm text-gray-600">
                                {new Date(record.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {record.recordType || 'General'}
                            </span>
                          </div>

                          {record.vitalSigns && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-blue-50 rounded-lg">
                              <div>
                                <p className="text-xs text-gray-600">Blood Pressure</p>
                                <p className="font-semibold text-blue-900">
                                  {record.vitalSigns.bloodPressure || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Heart Rate</p>
                                <p className="font-semibold text-blue-900">
                                  {record.vitalSigns.heartRate || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Temperature</p>
                                <p className="font-semibold text-blue-900">
                                  {record.vitalSigns.temperature || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Weight</p>
                                <p className="font-semibold text-blue-900">
                                  {record.vitalSigns.weight || 'N/A'}
                                </p>
                              </div>
                            </div>
                          )}

                          {record.diagnosis && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                              <p className="text-sm text-gray-600">{record.diagnosis}</p>
                            </div>
                          )}

                          {record.medications && record.medications.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-700">
                                Medications:
                              </p>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {record.medications.map((med, idx) => (
                                  <li key={idx}>{med}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {record.notes && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Notes:</p>
                              <p className="text-sm text-gray-600">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAppointment && patientRecords.length === 0 && (
                  <div className="card">
                    <p className="text-gray-500 text-center py-8">
                      No health records found for this patient.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div>
                {doctorProfile ? (
                  <ScheduleManagement doctorId={doctorProfile._id} />
                ) : (
                  <div className="card">
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                      <p className="ml-4 text-gray-600">Loading schedule...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorPanel;
