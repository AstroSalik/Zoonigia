import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-cosmic-blue hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass-morphism rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-12 h-12 text-cosmic-blue" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
              <p className="text-space-300 mt-2">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-space-200">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                Zoonigia Pvt Ltd ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact details (email, phone number, address)</li>
                <li>Date of birth and age information</li>
                <li>Educational background and interests</li>
                <li>Payment and billing information</li>
                <li>Login credentials (username, password)</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.3 Firebase Authentication Data</h3>
              <p>
                We use Firebase Authentication for secure user login, which may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email addresses</li>
                <li>Authentication tokens</li>
                <li>OAuth provider information (if using Google Sign-In)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing enrollments and registrations</li>
                <li>Processing payments and issuing certificates</li>
                <li>Sending important notifications and updates</li>
                <li>Improving our website and services</li>
                <li>Personalizing your learning experience</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Preventing fraud and enhancing security</li>
                <li>Complying with legal obligations</li>
                <li>Marketing and promotional communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Razorpay:</strong> For payment processing</li>
                <li><strong>Firebase:</strong> For authentication and hosting</li>
                <li><strong>Google Sheets:</strong> For data management (with encryption)</li>
                <li><strong>Neon Database:</strong> For secure data storage</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.2 Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.3 Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
                <li>Encrypted backup systems</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Maintain your login session</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve user experience</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data (subject to legal requirements)</li>
                <li><strong>Restriction:</strong> Limit how we use your data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:office@zoonigia.com" className="text-cosmic-blue hover:underline">office@zoonigia.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p>
                Our services are designed for users of all ages, including children. For users under 18 years of age, we require parental consent for registration. Parents and guardians have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review their child's personal information</li>
                <li>Request deletion of their child's data</li>
                <li>Refuse further collection of their child's information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="mt-4">
                When data is no longer needed, it will be securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
              <p>
                For questions or concerns about this Privacy Policy or our data practices:
              </p>
              <ul className="list-none pl-0 space-y-2">
                <li><strong>Privacy Concerns:</strong> <a href="mailto:office@zoonigia.com" className="text-cosmic-blue hover:underline">office@zoonigia.com</a></li>
                <li><strong>General Inquiries:</strong> <a href="mailto:info@zoonigia.com" className="text-cosmic-blue hover:underline">info@zoonigia.com</a></li>
                <li><strong>Support:</strong> <a href="mailto:help@zoonigia.com" className="text-cosmic-blue hover:underline">help@zoonigia.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+919596241169" className="text-cosmic-blue hover:underline">+91 9596241169</a></li>
                <li><strong>Address:</strong> Zoonigia Pvt Ltd, Industrial Area – Janwari Industries Building, Sopore, Baramulla, Jammu and Kashmir 193201, India</li>
              </ul>
            </section>

            <div className="mt-8 p-6 bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg">
              <p className="text-sm text-space-300">
                By using Zoonigia's services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

