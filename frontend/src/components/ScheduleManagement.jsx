import { useState, useEffect, useCallback } from 'react';
import { scheduleAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Plus, Trash2, Save, X } from 'lucide-react';

const ScheduleManagement = ({ doctorId }) => {
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
  });

  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'vacation',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const leaveTypes = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' },
  ];

  const fetchSchedules = useCallback(async () => {
    try {
      if (!doctorId) return;
      const { data } = await scheduleAPI.getDoctorSchedule(doctorId);
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }, [doctorId, toast]);

  const fetchLeaves = useCallback(async () => {
    try {
      const { data } = await scheduleAPI.getMyLeaves();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leaves');
    }
  }, [toast]);

  useEffect(() => {
    if (doctorId) {
      fetchSchedules();
      fetchLeaves();
    }
  }, [doctorId, fetchSchedules, fetchLeaves]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleAPI.createSchedule(scheduleForm);
      toast.success('Schedule added successfully!');
      fetchSchedules();
      setShowScheduleForm(false);
      setScheduleForm({
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add schedule');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await scheduleAPI.deleteSchedule(id);
      toast.success('Schedule deleted successfully');
      fetchSchedules();
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleAPI.applyLeave(leaveForm);
      toast.success('Leave applied successfully!');
      fetchLeaves();
      setShowLeaveForm(false);
      setLeaveForm({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'vacation',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply leave');
    }
  };

  const handleDeleteLeave = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave?')) return;
    try {
      await scheduleAPI.deleteLeave(id);
      toast.success('Leave deleted successfully');
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to delete leave');
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Schedule Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary-600" />
              Weekly Schedule
            </h2>
            <p className="text-sm text-gray-600 mt-1">Set your available hours for each day</p>
          </div>
          <button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="btn-primary flex items-center space-x-2"
          >
            {showScheduleForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showScheduleForm ? 'Cancel' : 'Add Schedule'}</span>
          </button>
        </div>

        {showScheduleForm && (
          <form onSubmit={handleScheduleSubmit} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={scheduleForm.dayOfWeek}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, dayOfWeek: e.target.value })}
                  className="input-field"
                  required
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (min)</label>
                <select
                  value={scheduleForm.slotDuration}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, slotDuration: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary mt-4 flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Schedule</span>
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No schedule set yet. Add your available hours!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeek.map((day) => {
              const daySchedules = schedules.filter((s) => s.dayOfWeek === day);
              return (
                <div key={day} className={`border rounded-lg p-4 ${daySchedules.length > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-semibold text-gray-900 mb-2">{day}</h3>
                  {daySchedules.length === 0 ? (
                    <p className="text-sm text-gray-500">Not available</p>
                  ) : (
                    <div className="space-y-2">
                      {daySchedules.map((schedule) => (
                        <div key={schedule._id} className="flex items-center justify-between bg-white p-2 rounded border border-green-300">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{schedule.startTime} - {schedule.endTime}</p>
                            <p className="text-xs text-gray-600">{schedule.slotDuration} min slots</p>
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(schedule._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leaves Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary-600" />
              Leaves & Holidays
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage your unavailable dates</p>
          </div>
          <button
            onClick={() => setShowLeaveForm(!showLeaveForm)}
            className="btn-secondary flex items-center space-x-2"
          >
            {showLeaveForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showLeaveForm ? 'Cancel' : 'Apply Leave'}</span>
          </button>
        </div>

        {showLeaveForm && (
          <form onSubmit={handleLeaveSubmit} className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="input-field"
                  required
                >
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Family vacation"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-4 flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Apply Leave</span>
            </button>
          </form>
        )}

        {leaves.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No leaves scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div key={leave._id} className="border border-orange-200 bg-orange-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-orange-200 text-orange-800 rounded">
                      {leave.type}
                    </span>
                    <p className="font-medium text-gray-900">{leave.reason}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLeave(leave._id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Delete leave"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;
