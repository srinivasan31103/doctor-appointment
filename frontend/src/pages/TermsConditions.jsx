import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react';
import Footer from '../components/Footer';

const TermsConditions = () => {
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
              <FileText className="h-10 w-10 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
            </div>

            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> January 2025
            </p>

            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using HealthCare+ platform, you agree to be bound by these Terms and Conditions.
                  If you do not agree to these terms, please do not use our services. These terms apply to all users,
                  including patients, doctors, and administrators.
                </p>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Account Registration</h3>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                          <li>You must provide accurate and complete information</li>
                          <li>You are responsible for maintaining account security</li>
                          <li>You must be at least 18 years old to register</li>
                          <li>One person may not maintain multiple accounts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-2">Prohibited Activities</h3>
                        <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                          <li>Sharing account credentials with others</li>
                          <li>Providing false medical information</li>
                          <li>Impersonating another person or entity</li>
                          <li>Attempting unauthorized access to the system</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Services */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Services Provided</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  HealthCare+ provides the following services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Online appointment scheduling with healthcare providers</li>
                  <li>Electronic health records management</li>
                  <li>Video consultation services</li>
                  <li>Medical history tracking and reporting</li>
                  <li>Prescription and diagnosis management</li>
                  <li>Health monitoring and vital signs tracking</li>
                </ul>
              </section>

              {/* Medical Disclaimer */}
              <section>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-2">4. Medical Disclaimer</h3>
                      <p className="text-yellow-800 text-sm mb-2">
                        <strong>Important:</strong> HealthCare+ is a platform that facilitates communication between
                        patients and healthcare providers. We do not provide medical advice, diagnosis, or treatment.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                        <li>Always seek professional medical advice for health concerns</li>
                        <li>In case of emergency, contact local emergency services immediately</li>
                        <li>Video consultations do not replace in-person medical examinations</li>
                        <li>Doctors using our platform are independent practitioners</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Scale className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">5. User Responsibilities</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">For Patients:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Provide accurate medical history and symptoms</li>
                      <li>Attend scheduled appointments or cancel in advance</li>
                      <li>Follow prescribed treatments responsibly</li>
                      <li>Pay applicable fees for services rendered</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">For Doctors:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Maintain valid medical license and credentials</li>
                      <li>Provide professional and ethical medical care</li>
                      <li>Maintain patient confidentiality</li>
                      <li>Keep accurate and timely medical records</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Appointment Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Appointment Policy</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Appointments must be scheduled through the platform</li>
                  <li>Cancellations should be made at least 24 hours in advance</li>
                  <li>Late arrivals may result in shortened consultation time</li>
                  <li>No-shows may result in cancellation fees</li>
                  <li>Video consultations require stable internet connection</li>
                </ul>
              </section>

              {/* Privacy & Data */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Your privacy is important to us. Our collection, use, and protection of your personal and medical
                  information are governed by our Privacy Policy. By using HealthCare+, you consent to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Collection and storage of your health information</li>
                  <li>Sharing of information with your designated healthcare providers</li>
                  <li>Use of data for platform improvement and analytics</li>
                  <li>Compliance with applicable healthcare privacy regulations</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Please read our{' '}
                  <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-700 font-medium">
                    Privacy Policy
                  </Link>
                  {' '}for detailed information.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  All content, features, and functionality of HealthCare+ platform, including but not limited to text,
                  graphics, logos, icons, images, and software, are the property of HealthCare+ and are protected by
                  intellectual property laws. You may not reproduce, distribute, or create derivative works without
                  express written permission.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    HealthCare+ provides the platform "as is" without warranties of any kind. We are not liable for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm mt-2">
                    <li>Medical outcomes resulting from use of the platform</li>
                    <li>Actions or omissions of healthcare providers</li>
                    <li>Technical issues, system downtime, or data loss</li>
                    <li>Unauthorized access to your account due to your negligence</li>
                    <li>Indirect, incidental, or consequential damages</li>
                  </ul>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We reserve the right to suspend or terminate your account if you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Violate these Terms and Conditions</li>
                  <li>Engage in fraudulent or illegal activities</li>
                  <li>Provide false information</li>
                  <li>Abuse or harass other users or staff</li>
                  <li>Fail to pay applicable fees</li>
                </ul>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may modify these Terms and Conditions at any time. Changes will be effective immediately upon
                  posting to the platform. Your continued use of HealthCare+ after changes constitutes acceptance
                  of the modified terms. We encourage you to review these terms periodically.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms and Conditions are governed by and construed in accordance with applicable healthcare
                  laws and regulations. Any disputes arising from these terms shall be resolved through appropriate
                  legal channels.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have questions about these Terms and Conditions, please contact us:
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

              {/* Acceptance */}
              <section className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Acceptance of Terms</h3>
                    <p className="text-green-800 text-sm">
                      By creating an account and using HealthCare+, you acknowledge that you have read, understood,
                      and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue
                      use of the platform immediately.
                    </p>
                  </div>
                </div>
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

export default TermsConditions;
