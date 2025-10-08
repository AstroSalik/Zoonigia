import { Link } from "wouter";
import { ArrowLeft, RefreshCw } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-cosmic-blue hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass-morphism rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <RefreshCw className="w-12 h-12 text-cosmic-blue" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Cancellation & Refund Policy</h1>
              <p className="text-space-300 mt-2">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-space-200">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Overview</h2>
              <p>
                At Zoonigia, we strive to provide exceptional educational experiences. However, we understand that circumstances may change. This policy outlines the terms for cancellations and refunds for our various services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Course Cancellations and Refunds</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Refund Eligibility Period</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>7-Day Money-Back Guarantee:</strong> Full refund if requested within 7 days of purchase</li>
                <li>Must not have completed more than 25% of the course content</li>
                <li>Must not have downloaded certificates</li>
                <li>Refund request must be submitted through your dashboard or email</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 After 7 Days</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>No refunds available after 7 days from purchase date</li>
                <li>Course access remains valid as per the enrollment terms</li>
                <li>Exceptional circumstances considered on case-by-case basis</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.3 Technical Issues</h3>
              <p>
                If you experience persistent technical issues preventing course access:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Report issues to technical support immediately</li>
                <li>We will work to resolve issues within 48 hours</li>
                <li>If unresolved, partial or full refund may be issued</li>
                <li>Extension of access period as compensation (alternative option)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Workshop Cancellations</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.1 Cancellation by Participant</h3>
              <p><strong>Cancellation Timeline and Refund Percentage:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>More than 15 days before workshop:</strong> 100% refund</li>
                <li><strong>8-14 days before workshop:</strong> 75% refund</li>
                <li><strong>3-7 days before workshop:</strong> 50% refund</li>
                <li><strong>Less than 3 days before workshop:</strong> No refund</li>
                <li><strong>No-show:</strong> No refund</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.2 Cancellation by Zoonigia</h3>
              <p>If we cancel or reschedule a workshop:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>100% full refund</strong> processed within 7-10 business days</li>
                <li><strong>OR</strong> Free transfer to another workshop of equal or lesser value</li>
                <li><strong>OR</strong> Credit for future workshops (120% of paid amount)</li>
                <li>Notification sent at least 48 hours in advance (except emergencies)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">3.3 Rescheduling</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free rescheduling available once, if requested 7+ days in advance</li>
                <li>Subject to availability in other batches</li>
                <li>₹500 fee for rescheduling within 7 days of workshop</li>
                <li>Rescheduling not available within 48 hours of workshop</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Campaign Registrations</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.1 Individual Registrations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Before registration deadline:</strong> Full refund minus processing fee (₹100)</li>
                <li><strong>After deadline:</strong> No refunds</li>
                <li><strong>Team registrations:</strong> Partial refunds possible for individual members</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">4.2 Campaign Cancellation</h3>
              <p>If a campaign is cancelled by Zoonigia:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>100% full refund to all participants</li>
                <li>Processed within 7-10 business days</li>
                <li>Alternative campaign participation offered (if available)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. School Partnership Programs</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom refund terms as per partnership agreement</li>
                <li>Negotiated cancellation clauses in contract</li>
                <li>Partial delivery and prorated refunds available</li>
                <li>Rescheduling preferred over cancellation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Refund Process</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.1 How to Request a Refund</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to your Zoonigia account</li>
                <li>Go to "My Enrollments" or "Order History"</li>
                <li>Click "Request Refund" on the eligible item</li>
                <li>Select reason for refund and provide details</li>
                <li><strong>OR</strong> Email <a href="mailto:help@zoonigia.com" className="text-cosmic-blue hover:underline">help@zoonigia.com</a> with:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Order/Registration ID</li>
                    <li>Registered email address</li>
                    <li>Reason for refund</li>
                    <li>Transaction screenshot (optional)</li>
                  </ul>
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.2 Refund Timeline</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Processing Time:</strong> 3-5 business days to review and approve</li>
                <li><strong>Refund Initiation:</strong> Within 7 business days of approval</li>
                <li><strong>Credit to Account:</strong> 5-10 business days (depending on bank/payment method)</li>
                <li><strong>Total Timeline:</strong> 10-20 business days from request</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">6.3 Refund Method</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds issued to original payment method</li>
                <li>Credit card refunds: 5-10 business days</li>
                <li>Debit card refunds: 7-10 business days</li>
                <li>UPI/Net Banking: 5-7 business days</li>
                <li>Wallet credits: Instant (alternative option)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Non-Refundable Items</h2>
              <p>The following are NOT eligible for refunds:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Completed courses (100% content accessed)</li>
                <li>Downloaded certificates</li>
                <li>Special promotional offers (unless otherwise stated)</li>
                <li>Bundled packages after partial access</li>
                <li>Customized one-on-one sessions (after delivery)</li>
                <li>Physical materials once shipped (except if damaged)</li>
                <li>Services availed under free or discounted coupons</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Payment Gateway Charges</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment gateway charges (typically 2-3%) are non-refundable</li>
                <li>Deducted from refund amount</li>
                <li>Clearly mentioned during refund processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Failed Transactions</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.1 Payment Deducted but Order Not Created</h3>
              <p>If amount was deducted but you didn't receive access:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wait 30 minutes for auto-processing</li>
                <li>Check your dashboard for order status</li>
                <li>If still not resolved, contact support with transaction ID</li>
                <li>Automatic refund within 7 business days if order not found</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">9.2 Double Payment</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact support immediately with both transaction IDs</li>
                <li>Full refund of duplicate charge within 7 business days</li>
                <li>No need to return product/cancel access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Dispute Resolution</h2>
              <p>
                If you disagree with a refund decision:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email escalation to <a href="mailto:office@zoonigia.com" className="text-cosmic-blue hover:underline">office@zoonigia.com</a></li>
                <li>Provide detailed explanation and supporting documents</li>
                <li>Management review within 5 business days</li>
                <li>Final decision communicated via email</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Wallet Credits and Coupons</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-4">11.1 Zoonigia Credits</h3>
              <p>As an alternative to refunds, we may offer:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Wallet Credits:</strong> 110% of refund amount</li>
                <li>Valid for 1 year from issuance</li>
                <li>Can be used for any Zoonigia service</li>
                <li>Non-transferable and non-refundable</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-4">11.2 Discount Coupons</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cannot be refunded if discount already applied</li>
                <li>Refund calculated on discounted amount paid</li>
                <li>Used coupons cannot be reused</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Special Circumstances</h2>
              <p>We understand that exceptional situations occur. Contact us for consideration in cases of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Medical emergencies (documentation required)</li>
                <li>Natural disasters or force majeure events</li>
                <li>Death in the family</li>
                <li>Relocation or travel restrictions</li>
              </ul>
              <p className="mt-4">
                Each case will be reviewed individually and handled with compassion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact for Refund Support</h2>
              <p>
                For refund-related queries:
              </p>
              <ul className="list-none pl-0 space-y-2">
                <li><strong>Support Email:</strong> <a href="mailto:help@zoonigia.com" className="text-cosmic-blue hover:underline">help@zoonigia.com</a></li>
                <li><strong>General Inquiries:</strong> <a href="mailto:info@zoonigia.com" className="text-cosmic-blue hover:underline">info@zoonigia.com</a></li>
                <li><strong>Office:</strong> <a href="mailto:office@zoonigia.com" className="text-cosmic-blue hover:underline">office@zoonigia.com</a></li>
                <li><strong>Phone:</strong> <a href="tel:+919596241169" className="text-cosmic-blue hover:underline">+91 9596241169</a></li>
                <li><strong>Address:</strong> Zoonigia Pvt Ltd, Industrial Area – Janwari Industries Building, Sopore, Baramulla, Jammu and Kashmir 193201, India</li>
                <li><strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</li>
                <li><strong>Response Time:</strong> Within 24-48 hours</li>
              </ul>
            </section>

            <div className="mt-8 p-6 bg-cosmic-blue/10 border border-cosmic-blue/30 rounded-lg">
              <p className="text-sm text-space-300">
                This cancellation and refund policy is subject to change. We reserve the right to modify these terms and will notify users of significant changes. For the most up-to-date policy, please visit this page regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;

