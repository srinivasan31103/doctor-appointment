import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usersAPI, appointmentsAPI, recordsAPI, doctorsAPI, scheduleAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UserModal from '../components/UserModal';
import AppointmentEditModal from '../components/AppointmentEditModal';
import MonthlyAnalytics from '../components/MonthlyAnalytics';
import { Users, Calendar, Activity, Stethoscope, Trash2, Edit, Plus, Check, X as XIcon } from 'lucide-react';

const AdminPanel = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';

  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    // Update active tab when URL changes
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const fetchAllData = async () => {
    try {
      const [usersRes, doctorsRes, appointmentsRes, recordsRes, leavesRes] = await Promise.all([
        usersAPI.getAll(),
        doctorsAPI.getAll(),
        appointmentsAPI.getAll(),
        recordsAPI.getAll(),
        scheduleAPI.getAllLeaves(),
      ]);

      setUsers(usersRes.data);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
      setRecords(recordsRes.data);
      setLeaves(leavesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(id);
      fetchAllData();
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await doctorsAPI.delete(id);
      fetchAllData();
      toast.success('Doctor deleted successfully');
    } catch (error) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await appointmentsAPI.delete(id);
      fetchAllData();
      toast.success('Appointment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleSaveAppointment = async (id, data) => {
    try {
      await appointmentsAPI.update(id, data);
      fetchAllData();
      toast.success('Appointment updated successfully');
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const handleReviewLeave = async (id, status, reviewNotes = '') => {
    try {
      await scheduleAPI.reviewLeave(id, { status, reviewNotes });
      fetchAllData();
      toast.success(`Leave request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} leave request`);
    }
  };

  // User CRUD handlers
  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (userData) => {
    try {
      if (modalMode === 'create') {
        await usersAPI.create(userData);
        alert('User created successfully!');
      } else {
        await usersAPI.update(selectedUser._id, userData);
        alert('User updated successfully!');
      }
      setIsUserModalOpen(false);
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${modalMode} user`);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalDoctors: doctors.length,
    totalAppointments: appointments.length,
    totalRecords: records.length,
    pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
    completedAppointments: appointments.filter((a) => a.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 mt-16 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage system users and monitor statistics</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-500" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalDoctors}</p>
                  </div>
                  <Stethoscope className="h-12 w-12 text-green-500" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Appointments</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-purple-500" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Health Records</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalRecords}</p>
                  </div>
                  <Activity className="h-12 w-12 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {['overview', 'users', 'doctors', 'appointments', 'leaves', 'analytics'].map((tab) => (
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

            {/* Tab Content */}
            {loading ? (
              <div className="card">
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                      <div className="space-y-2">
                        {users.slice(0, 5).map((user) => (
                          <div key={user._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded">
                              {user.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">Appointment Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                          <span className="font-medium">Pending</span>
                          <span className="text-2xl font-bold">{stats.pendingAppointments}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                          <span className="font-medium">Completed</span>
                          <span className="text-2xl font-bold">{stats.completedAppointments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="card">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">All Users</h3>
                      <button
                        onClick={handleCreateUser}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add New User</span>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{user.phone || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Edit user"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Delete user"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'doctors' && (
                  <div className="card">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">All Doctors</h3>
                      <p className="text-sm text-gray-600">
                        Note: Doctors must have user accounts first. Editing functionality coming soon.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Specialization
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Experience
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Fee
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {doctors.map((doctor) => (
                            <tr key={doctor._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {doctor.userId?.name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{doctor.specialization}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{doctor.experience} years</td>
                              <td className="px-6 py-4 whitespace-nowrap">₹{doctor.consultationFee}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteDoctor(doctor._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">All Appointments</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Patient
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Doctor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {appointment.patientId?.name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {appointment.doctorId?.userId?.name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(appointment.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleEditAppointment(appointment)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Edit appointment"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAppointment(appointment._id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Delete appointment"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Leaves Tab */}
                {activeTab === 'leaves' && (
                  <div className="card">
                    <h2 className="text-lg font-semibold mb-4">Doctor Leave Requests</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {leaves.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                No leave requests found
                              </td>
                            </tr>
                          ) : (
                            leaves.map((leave) => (
                              <tr key={leave._id} className={
                                leave.status === 'pending' ? 'bg-yellow-50' :
                                leave.status === 'approved' ? 'bg-green-50' :
                                'bg-red-50'
                              }>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {leave.doctorId?.userId?.name || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {leave.doctorId?.specialization || 'N/A'}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded capitalize">
                                    {leave.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(leave.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                  <p className="text-sm text-gray-900 truncate">{leave.reason}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${
                                    leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {leave.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {leave.status === 'pending' ? (
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleReviewLeave(leave._id, 'approved')}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                        title="Approve"
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleReviewLeave(leave._id, 'rejected')}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                        title="Reject"
                                      >
                                        <XIcon className="h-4 w-4 mr-1" />
                                        Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500">
                                      {leave.reviewedBy?.name && (
                                        <div>Reviewed by: {leave.reviewedBy.name}</div>
                                      )}
                                      {leave.reviewedAt && (
                                        <div>{new Date(leave.reviewedAt).toLocaleDateString()}</div>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <MonthlyAnalytics />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleUserSubmit}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Appointment Edit Modal */}
      <AppointmentEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};

export default AdminPanel;
