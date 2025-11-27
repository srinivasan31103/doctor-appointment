import { Sparkles } from 'lucide-react';

const AIAdviceBox = ({ advice, loading }) => {
  if (loading) {
    return (
      <div className="card bg-gradient-to-r from-primary-50 to-medical-light border-l-4 border-primary-600">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="h-6 w-6 text-primary-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">AI Health Advice</h3>
        </div>
        <p className="text-gray-600 italic">Generating personalized advice...</p>
      </div>
    );
  }

  if (!advice) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-r from-primary-50 to-medical-light border-l-4 border-primary-600">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="h-6 w-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-800">AI Health Advice</h3>
        <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">
          Powered by Claude AI
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{advice}</p>
      <div className="mt-4 text-xs text-gray-500 italic">
        * This is AI-generated advice. Please consult with a healthcare professional for
        medical decisions.
      </div>
    </div>
  );
};

export default AIAdviceBox;
