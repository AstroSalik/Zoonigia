import { Link } from "wouter";
import { ArrowLeft, FileText } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-cosmic-blue hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass-morphism rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-12 h-12 text-cosmic-blue" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Terms and Conditions</h1>
              <p className="text-space-300 mt-2">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-space-200">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Zoonigia's website, services, workshops, courses, and campaigns, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Services Overview</h2>
              <p>
                Zoonigia provides educational services including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Online and offline workshops in frontier sciences</li>
                <li>Educational courses and learning programs</li>
                <li>Innovation campaigns and competitions</li>
                <li>School partnership programs</li>
                <li>Telescope sessions and VR experiences</li>
                <li>Research lab access and expert mentorship</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Registration and Account</h2>
              <p>
                To access certain features, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
              <p>
                For paid services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                <li>Payment must be completed before accessing paid content</li>
                <li>We accept payments through Razorpay and other authorized payment gateways</li>
                <li>Prices are subject to change with prior notice</li>
                <li>Invoices will be provided for all transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Course Enrollment and Access</h2>
              <p>
                Upon successful payment:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You will receive immediate access to enrolled courses</li>
                <li>Course content remains accessible as per the course duration specified</li>
                <li>You may not share, distribute, or resell course materials</li>
                <li>Certificates are awarded upon successful course completion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Workshop and Event Participation</h2>
              <p>
                For workshops and events:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Registration is required in advance</li>
                <li>Participants must arrive on time for offline events</li>
                <li>We reserve the right to refuse entry for non-compliance</li>
                <li>Photography and videography may be conducted for promotional purposes</li>
                <li>Participants are responsible for their personal belongings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
              <p>
                All content, including but not limited to text, graphics, logos, images, videos, and software, is the property of Zoonigia Pvt Ltd and is protected by Indian and international copyright laws. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reproduce, distribute, or modify our content without permission</li>
                <li>Use our materials for commercial purposes</li>
                <li>Remove copyright or proprietary notices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. User Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for any unlawful purpose</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Upload viruses or malicious code</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the proper functioning of the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                Zoonigia Pvt Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We do not guarantee uninterrupted or error-free service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our <Link href="/privacy-policy" className="text-cosmic-blue hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Termination</h2>
              <p>
                We may terminate or suspend your account and access to services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Baramulla, Jammu and Kashmir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="list-none pl-0 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:info@zoonigia.com" className="text-cosmic-blue hover:underline">info@zoonigia.com</a></li>
                <li><strong>Support:</strong> <a href="mailto:help@zoonigia.com" className="text-cosmic-blue hover:underline">help@zoonigia.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+919596241169" className="text-cosmic-blue hover:underline">+91 9596241169</a></li>
                <li><strong>Address:</strong> Zoonigia Pvt Ltd, Industrial Area – Janwari Industries Building, Sopore, Baramulla, Jammu and Kashmir 193201, India</li>
              </ul>
            </section>

            <div className="mt-8 p-6 bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg">
              <p className="text-sm text-space-300">
                By using Zoonigia's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

