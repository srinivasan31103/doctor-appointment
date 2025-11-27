import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AppointmentEditModal = ({ isOpen, onClose, appointment, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      // Format date for input (YYYY-MM-DD)
      const appointmentDate = new Date(appointment.date);
      const formattedDate = appointmentDate.toISOString().split('T')[0];

      setFormData({
        date: formattedDate,
        time: appointment.time || '',
        reason: appointment.reason || '',
        symptoms: appointment.symptoms || '',
        status: appointment.status || 'pending',
      });
    }
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(appointment._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Edit Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Info (Read-only) */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Patient Information</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {appointment.patientId?.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {appointment.patientId?.email}
            </p>
          </div>

          {/* Doctor Info (Read-only) */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Doctor Information</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {appointment.doctorId?.userId?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Specialization:</span> {appointment.doctorId?.specialization || 'N/A'}
            </p>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit *
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="e.g., Regular checkup, Follow-up consultation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Symptoms */}
          <div>
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms (Optional)
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
              placeholder="Describe any symptoms..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentEditModal;
