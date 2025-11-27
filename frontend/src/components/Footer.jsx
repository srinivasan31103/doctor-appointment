import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold text-primary-400">HealthCare+</span>
          </div>

          {/* Contact & Copyright */}
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">
              © {currentYear} HealthCare+. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <a
                  href="tel:+919360705681"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  +91 9360705681
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <a
                  href="mailto:sri31103@gmail.com"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  sri31103@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-gray-300 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Developed by */}
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-xs">
            Developed with <Heart className="h-3 w-3 inline text-red-500" /> by{' '}
            <a
              href="https://www.linkedin.com/in/srinivasan-n-47696821a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Srinivasan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
