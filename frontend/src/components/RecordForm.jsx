import { useState } from 'react';
import { recordsAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Activity } from 'lucide-react';

const RecordForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    sugarLevel: '',
    weight: '',
    heartRate: '',
    temperature: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recordData = {
        bloodPressure: {
          systolic: Number(formData.systolic),
          diastolic: Number(formData.diastolic),
        },
        sugarLevel: Number(formData.sugarLevel),
        weight: Number(formData.weight),
        heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
        temperature: formData.temperature ? Number(formData.temperature) : undefined,
        note: formData.note,
      };

      await recordsAPI.create(recordData);

      // Reset form
      setFormData({
        systolic: '',
        diastolic: '',
        sugarLevel: '',
        weight: '',
        heartRate: '',
        temperature: '',
        note: '',
      });

      toast.success('Health record added successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="h-6 w-6 text-primary-600" />
        <h2 className="card-header mb-0">Add Health Record</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Systolic BP (mmHg) *
            </label>
            <input
              type="number"
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diastolic BP (mmHg) *
            </label>
            <input
              type="number"
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Sugar (mg/dL) *
            </label>
            <input
              type="number"
              name="sugarLevel"
              value={formData.sugarLevel}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              className="input-field"
              placeholder="72"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              className="input-field"
              placeholder="98.6"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            className="input-field"
            placeholder="Any additional notes..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Adding Record...' : 'Add Health Record'}
        </button>
      </form>
    </div>
  );
};

export default RecordForm;
