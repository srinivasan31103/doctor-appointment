import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-primary-700">HealthCare+</span>
            </div>
            <Link
              to="/login"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-10 w-10 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>

            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> January 2025
            </p>

            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to HealthCare+. We are committed to protecting your personal information and your right to privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                  healthcare management platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Database className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Name, email address, phone number</li>
                      <li>Date of birth, gender, blood group</li>
                      <li>Medical history and health records</li>
                      <li>Appointment details and consultation notes</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Automatically Collected Information</h3>
                    <ul className="list-disc list-inside space-y-1 text-green-800">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Usage data and activity logs</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <UserCheck className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>To provide and maintain our healthcare services</li>
                  <li>To manage your appointments and medical records</li>
                  <li>To facilitate communication between patients and doctors</li>
                  <li>To send important notifications and updates</li>
                  <li>To improve our platform and user experience</li>
                  <li>To ensure compliance with healthcare regulations</li>
                  <li>To provide video consultation services</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We implement industry-standard security measures to protect your personal and medical information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Technical Measures</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Secure authentication and authorization</li>
                      <li>Regular security audits and updates</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Administrative Measures</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Limited access to authorized personnel</li>
                      <li>Employee training on data protection</li>
                      <li>Incident response procedures</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Your Privacy Rights */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Your Privacy Rights</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell your personal information. We may share your data only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>With healthcare providers for treatment purposes</li>
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>With service providers who assist in platform operations (under strict confidentiality)</li>
                </ul>
              </section>

              {/* HIPAA Compliance */}
              <section>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">Healthcare Compliance</h3>
                      <p className="text-yellow-800 text-sm">
                        HealthCare+ is committed to complying with applicable healthcare privacy regulations.
                        We implement appropriate safeguards to protect Protected Health Information (PHI) and
                        maintain confidentiality in accordance with healthcare privacy standards.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:sri31103@gmail.com" className="text-primary-600 hover:text-primary-700">
                      sri31103@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong>{' '}
                    <a href="tel:+919360705681" className="text-primary-600 hover:text-primary-700">
                      +91 9360705681
                    </a>
                  </p>
                </div>
              </section>

              {/* Updates to Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                  the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review
                  this Privacy Policy periodically for any changes.
                </p>
              </section>
            </div>

            {/* Back Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
