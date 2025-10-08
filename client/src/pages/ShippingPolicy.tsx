import { Link } from "wouter";
import { ArrowLeft, Package } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-cosmic-blue hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass-morphism rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Package className="w-12 h-12 text-cosmic-blue" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Shipping & Delivery Policy</h1>
              <p className="text-space-300 mt-2">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-space-200">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Service Nature</h2>
              <p>
                Zoonigia primarily provides <strong>educational services and digital content</strong>. This policy covers both our digital offerings and physical materials (if applicable).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Digital Content Delivery</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Instant Access</h3>
              <p>
                Upon successful payment confirmation:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Online Courses:</strong> Immediate access granted to course dashboard and materials</li>
                <li><strong>Digital Resources:</strong> Instant download or streaming access</li>
                <li><strong>Workshop Enrollment:</strong> Confirmation email sent within 5 minutes</li>
                <li><strong>Campaign Registration:</strong> Instant confirmation and access to participant portal</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Access Duration</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Lifetime course access (unless otherwise specified)</li>
                <li>Workshop recordings available for 90 days post-event</li>
                <li>Campaign materials accessible throughout the campaign duration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Workshop and Event Confirmations</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.1 Registration Confirmation</h3>
              <p>After successful registration:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Instant email confirmation with registration details</li>
                <li>Event access link (for online workshops) sent 24 hours before event</li>
                <li>Venue details and instructions (for offline events) sent 48 hours prior</li>
                <li>Calendar invite with event schedule</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.2 Event Materials</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Digital materials provided via email or dashboard</li>
                <li>Physical kits (if included) shipped 5-7 days before workshop</li>
                <li>Pre-workshop preparation materials sent 1 week in advance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Physical Materials (If Applicable)</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.1 Shipping Locations</h3>
              <p>We currently ship physical materials within:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All major cities in India</li>
                <li>Select locations for special workshop kits</li>
                <li>International shipping on special request (additional charges apply)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.2 Delivery Timeline</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Metro Cities:</strong> 3-5 business days</li>
                <li><strong>Other Cities:</strong> 5-7 business days</li>
                <li><strong>Remote Areas:</strong> 7-10 business days</li>
                <li><strong>International:</strong> 10-21 business days (varies by country)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.3 Shipping Charges</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free shipping on orders above ₹1000 within India</li>
                <li>Standard shipping: ₹50-150 based on location</li>
                <li>Express shipping: Available at additional cost</li>
                <li>International shipping calculated at checkout</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Certificate Delivery</h2>
              <p>Upon successful course completion:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Digital Certificate:</strong> Instant download from dashboard</li>
                <li><strong>Verified Certificate:</strong> Available with blockchain verification</li>
                <li><strong>Physical Certificate:</strong> Printed and shipped within 15 days (optional, additional charges)</li>
                <li>All certificates include unique verification codes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Tracking and Updates</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.1 Order Tracking</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Track your order status in your user dashboard</li>
                <li>Email notifications at each stage of delivery</li>
                <li>SMS updates for physical shipments</li>
                <li>Tracking number provided via email</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.2 Communication</h3>
              <p>We will notify you via:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email (primary communication channel)</li>
                <li>SMS for important updates</li>
                <li>Dashboard notifications</li>
                <li>WhatsApp updates (if opted in)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Delivery Issues</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.1 Failed Delivery</h3>
              <p>In case of failed delivery of physical materials:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courier will attempt delivery 2-3 times</li>
                <li>You will be notified of failed attempts</li>
                <li>Package held at local office for 5 days for pickup</li>
                <li>Contact us within 5 days to arrange redelivery</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.2 Incorrect Address</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verify shipping address during checkout</li>
                <li>Address changes possible within 24 hours of order</li>
                <li>Redelivery charges may apply for incorrect addresses</li>
                <li>Contact support immediately if address needs correction</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">7.3 Lost or Damaged Items</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Report damaged items within 48 hours of delivery</li>
                <li>Provide photos of damaged packaging and items</li>
                <li>Free replacement or refund for damaged items</li>
                <li>Lost shipments will be reinvestigated and reshipped</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Digital Access Issues</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.1 Technical Problems</h3>
              <p>If you experience issues accessing digital content:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Check your internet connection</li>
                <li>Clear browser cache and cookies</li>
                <li>Try a different browser or device</li>
                <li>Contact technical support: <a href="mailto:help@zoonigia.com" className="text-cosmic-blue hover:underline">help@zoonigia.com</a></li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">8.2 Login Issues</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use password reset if you've forgotten credentials</li>
                <li>Verify email address is correct</li>
                <li>Check spam folder for verification emails</li>
                <li>Contact support if issues persist</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Force Majeure</h2>
              <p>
                We are not liable for delays or failures in delivery due to circumstances beyond our control, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Natural disasters</li>
                <li>Government restrictions</li>
                <li>Strikes or labor disputes</li>
                <li>Technical failures</li>
                <li>Pandemic-related restrictions</li>
              </ul>
              <p className="mt-4">
                In such cases, we will make reasonable efforts to notify you and provide alternative arrangements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact for Delivery Support</h2>
              <p>
                For questions about delivery or shipping:
              </p>
              <ul className="list-none pl-0 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:help@zoonigia.com" className="text-cosmic-blue hover:underline">help@zoonigia.com</a></li>
                <li><strong>General Inquiries:</strong> <a href="mailto:info@zoonigia.com" className="text-cosmic-blue hover:underline">info@zoonigia.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+919596241169" className="text-cosmic-blue hover:underline">+91 9596241169</a></li>
                <li><strong>Address:</strong> Zoonigia Pvt Ltd, Industrial Area – Janwari Industries Building, Sopore, Baramulla, Jammu and Kashmir 193201, India</li>
                <li><strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</li>
                <li><strong>Response Time:</strong> Within 24 hours</li>
              </ul>
            </section>

            <div className="mt-8 p-6 bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg">
              <p className="text-sm text-space-300">
                This shipping and delivery policy applies to all services and products offered by Zoonigia Pvt Ltd. We reserve the right to update this policy and will notify users of significant changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

