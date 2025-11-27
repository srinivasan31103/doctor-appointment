import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recordsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RecordForm from '../components/RecordForm';
import AIAdviceBox from '../components/AIAdviceBox';
import {
  FileText,
  Activity,
  Droplet,
  Weight,
  Heart,
  Calendar,
  Clock,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const HealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
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

  const handleRecordAdded = () => {
    fetchRecords();
    setShowForm(false);
  };

  const toggleRecord = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const getHealthStatus = (record) => {
    const alerts = [];

    if (record.bloodPressure.systolic > 140 || record.bloodPressure.diastolic > 90) {
      alerts.push({ type: 'High Blood Pressure', severity: 'high' });
    } else if (record.bloodPressure.systolic < 90 || record.bloodPressure.diastolic < 60) {
      alerts.push({ type: 'Low Blood Pressure', severity: 'medium' });
    }

    if (record.sugarLevel > 125) {
      alerts.push({ type: 'High Blood Sugar', severity: 'high' });
    } else if (record.sugarLevel < 70) {
      alerts.push({ type: 'Low Blood Sugar', severity: 'high' });
    }

    if (record.heartRate && (record.heartRate > 100 || record.heartRate < 60)) {
      alerts.push({ type: 'Abnormal Heart Rate', severity: 'medium' });
    }

    return alerts;
  };

  const getTrendIcon = (currentValue, previousValue) => {
    if (!previousValue) return <Minus className="h-4 w-4 text-gray-400" />;
    if (currentValue > previousValue) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (currentValue < previousValue) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' ||
      record.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(record.date).toLocaleDateString().includes(searchTerm);

    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'alerts') return getHealthStatus(record).length > 0 && matchesSearch;
    if (filterBy === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(record.date) >= weekAgo && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="max-w-7xl mx-auto">

            {/* Medical Records Header */}
            <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="h-10 w-10" />
                    <h1 className="text-4xl font-bold">Medical Health Records</h1>
                  </div>
                  <p className="text-indigo-100 text-lg">
                    Complete history of your health measurements and medical data
                  </p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                      <User className="h-4 w-4" />
                      <span>{user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                      <FileText className="h-4 w-4" />
                      <span>{records.length} Total Records</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="hidden md:flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Record</span>
                </button>
              </div>
            </div>

            {/* Mobile Add Button */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Record</span>
              </button>
            </div>

            {/* Record Form */}
            {showForm && (
              <div className="mb-8 animate-fadeIn">
                <RecordForm onSuccess={handleRecordAdded} />
              </div>
            )}

            {/* Search and Filter Section */}
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by date or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Records</option>
                    <option value="recent">Last 7 Days</option>
                    <option value="alerts">With Health Alerts</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Records Timeline */}
            {loading ? (
              <div className="card text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading your medical records...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm || filterBy !== 'all' ? 'No matching records found' : 'No health records yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterBy !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start tracking your health by adding your first record'}
                </p>
                {!searchTerm && filterBy === 'all' && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Record
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record, index) => {
                  const previousRecord = filteredRecords[index + 1];
                  const healthAlerts = getHealthStatus(record);
                  const isExpanded = expandedRecord === record._id;

                  return (
                    <div key={record._id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-indigo-500">
                      {/* Record Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-indigo-100 p-3 rounded-lg">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(record.date).toLocaleTimeString()}</span>
                              {index === 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded">
                                  LATEST
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleRecord(record._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Health Alerts */}
                      {healthAlerts.length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-red-600" />
                            <span className="font-semibold text-red-900">Health Alerts:</span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {healthAlerts.map((alert, idx) => (
                              <p key={idx} className="text-sm text-red-700 ml-7">
                                • {alert.type}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vital Signs Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {/* Blood Pressure */}
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <Activity className="h-5 w-5 text-red-600" />
                            {previousRecord && getTrendIcon(
                              record.bloodPressure.systolic,
                              previousRecord.bloodPressure.systolic
                            )}
                          </div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Blood Pressure</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                          </p>
                          <p className="text-xs text-gray-500">mmHg</p>
                        </div>

                        {/* Blood Sugar */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <Droplet className="h-5 w-5 text-blue-600" />
                            {previousRecord && getTrendIcon(
                              record.sugarLevel,
                              previousRecord.sugarLevel
                            )}
                          </div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Blood Sugar</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {record.sugarLevel}
                          </p>
                          <p className="text-xs text-gray-500">mg/dL</p>
                        </div>

                        {/* Weight */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <Weight className="h-5 w-5 text-green-600" />
                            {previousRecord && getTrendIcon(
                              record.weight,
                              previousRecord.weight
                            )}
                          </div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Weight</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {record.weight}
                          </p>
                          <p className="text-xs text-gray-500">kg</p>
                        </div>

                        {/* Heart Rate */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <Heart className="h-5 w-5 text-purple-600" />
                            {previousRecord && record.heartRate && previousRecord.heartRate && getTrendIcon(
                              record.heartRate,
                              previousRecord.heartRate
                            )}
                          </div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Heart Rate</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {record.heartRate || '--'}
                          </p>
                          <p className="text-xs text-gray-500">bpm</p>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                          {/* Notes Section */}
                          {record.note && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-600" />
                                Notes
                              </h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {record.note}
                              </p>
                            </div>
                          )}

                          {/* AI Advice */}
                          {record.aiAdvice && (
                            <div className="mb-4">
                              <AIAdviceBox advice={record.aiAdvice} />
                            </div>
                          )}

                          {/* Detailed Measurements */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="font-semibold text-gray-700 mb-2">Blood Pressure Details</h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Systolic:</span>
                                  <span className="font-medium">{record.bloodPressure.systolic} mmHg</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Diastolic:</span>
                                  <span className="font-medium">{record.bloodPressure.diastolic} mmHg</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`font-medium ${
                                    record.bloodPressure.systolic > 140 ? 'text-red-600' :
                                    record.bloodPressure.systolic < 90 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    {record.bloodPressure.systolic > 140 ? 'High' :
                                     record.bloodPressure.systolic < 90 ? 'Low' : 'Normal'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="font-semibold text-gray-700 mb-2">Additional Metrics</h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Blood Sugar:</span>
                                  <span className="font-medium">{record.sugarLevel} mg/dL</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Body Weight:</span>
                                  <span className="font-medium">{record.weight} kg</span>
                                </div>
                                {record.heartRate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Heart Rate:</span>
                                    <span className="font-medium">{record.heartRate} bpm</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Record Metadata */}
                          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>Record ID: {record._id}</span>
                              <span>Created: {new Date(record.createdAt || record.date).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary Footer */}
            {filteredRecords.length > 0 && (
              <div className="card mt-8 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="text-center">
                  <p className="text-gray-700">
                    Showing <span className="font-bold text-indigo-600">{filteredRecords.length}</span> of{' '}
                    <span className="font-bold text-indigo-600">{records.length}</span> total health records
                  </p>
                  {filterBy !== 'all' || searchTerm !== '' ? (
                    <button
                      onClick={() => {
                        setFilterBy('all');
                        setSearchTerm('');
                      }}
                      className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Clear filters
                    </button>
                  ) : null}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default HealthRecords;
