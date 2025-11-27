import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Heart, Mail, Lock } from 'lucide-react';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful! Welcome back.');
      // Redirect based on role
      if (result.data.role === 'admin') {
        navigate('/admin-panel');
      } else if (result.data.role === 'doctor') {
        navigate('/doctor-panel');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-medical-light flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-primary-700">HealthCare+</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="font-semibold text-green-900 mb-2">✅ Demo Accounts (Ready to Use):</p>
          <div className="space-y-1 text-green-800">
            <p><strong>Admin:</strong> admin@healthcare.com / admin123</p>
            <p><strong>Doctor:</strong> doctor@healthcare.com / doctor123</p>
            <p><strong>Patient:</strong> user@healthcare.com / user123</p>
          </div>
          <p className="mt-2 text-xs text-green-700">All accounts are active and ready to login!</p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
