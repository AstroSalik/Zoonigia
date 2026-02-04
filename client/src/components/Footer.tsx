import { Link } from "wouter";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-space-800 py-12 border-t border-space-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/zoonigia-logo.svg" 
                alt="Zoonigia Logo" 
                className="h-8 w-auto brightness-110 contrast-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
              />
            </div>
            <p className="text-space-300 mb-4">
              Empowering future innovators and explorers through immersive science education.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/zoonigia/" target="_blank" rel="noopener noreferrer" className="text-cosmic-blue hover:text-blue-400 transition-colors" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/zoonigia?igsh=MWZ2c3p6d3RsZWNpbQ==" target="_blank" rel="noopener noreferrer" className="text-cosmic-blue hover:text-blue-400 transition-colors" data-testid="link-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://chat.whatsapp.com/FKvscXisb9A99paGjqQSzR" target="_blank" rel="noopener noreferrer" className="text-cosmic-blue hover:text-blue-400 transition-colors" data-testid="link-whatsapp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-space-50">Quick Links</h4>
            <ul className="space-y-2 text-space-300">
              <li><Link href="/workshops" className="hover:text-cosmic-blue transition-colors">Workshops</Link></li>
              <li><Link href="/courses" className="hover:text-cosmic-blue transition-colors">Courses</Link></li>
              <li><Link href="/campaigns" className="hover:text-cosmic-blue transition-colors">Campaigns</Link></li>
              <li><Link href="/schools" className="hover:text-cosmic-blue transition-colors">Schools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-space-50">Programs</h4>
            <ul className="space-y-2 text-space-300">
              <li><a href="#" className="hover:text-cosmic-blue transition-colors">Telescope Sessions</a></li>
              <li><a href="#" className="hover:text-cosmic-blue transition-colors">VR Experiences</a></li>
              <li><a href="#" className="hover:text-cosmic-blue transition-colors">Research Labs</a></li>
              <li><a href="#" className="hover:text-cosmic-blue transition-colors">Expert Sessions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-space-50">Contact</h4>
            <ul className="space-y-2 text-space-300">
              <li><a href="mailto:info@zoonigia.com" className="hover:text-cosmic-blue transition-colors">General Info</a></li>
              <li><a href="mailto:workshops@zoonigia.com" className="hover:text-cosmic-blue transition-colors">Workshops</a></li>
              <li><a href="mailto:campaigns@zoonigia.com" className="hover:text-cosmic-blue transition-colors">Campaigns</a></li>
              <li><a href="mailto:outreach@zoonigia.com" className="hover:text-cosmic-blue transition-colors">Partnerships</a></li>
              <li><a href="tel:+919596241169" className="hover:text-cosmic-blue transition-colors">+91 9596241169</a></li>
              <li><Link href="/contact" className="hover:text-cosmic-blue transition-colors">All Contacts</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-space-600 mt-8 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <h5 className="text-sm font-semibold mb-3 text-space-100">Legal</h5>
              <ul className="space-y-2 text-sm text-space-400">
                <li><Link href="/terms-and-conditions" className="hover:text-cosmic-blue transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-cosmic-blue transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold mb-3 text-space-100">Policies</h5>
              <ul className="space-y-2 text-sm text-space-400">
                <li><Link href="/shipping-policy" className="hover:text-cosmic-blue transition-colors">Shipping & Delivery</Link></li>
                <li><Link href="/refund-policy" className="hover:text-cosmic-blue transition-colors">Cancellation & Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold mb-3 text-space-100">Resources</h5>
              <ul className="space-y-2 text-sm text-space-400">
                <li><Link href="/about" className="hover:text-cosmic-blue transition-colors">About Us</Link></li>
                <li><Link href="/our-pledge" className="hover:text-cosmic-blue transition-colors">Our Pledge</Link></li>
                <li><Link href="/blog" className="hover:text-cosmic-blue transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold mb-3 text-space-100">Community</h5>
              <ul className="space-y-2 text-sm text-space-400">
                <li><a href="https://chat.whatsapp.com/FKvscXisb9A99paGjqQSzR" target="_blank" rel="noopener noreferrer" className="hover:text-cosmic-blue transition-colors">WhatsApp Community</a></li>
                <li><Link href="/leaderboard" className="hover:text-cosmic-blue transition-colors">Leaderboard</Link></li>
                <li><Link href="/collaborators" className="hover:text-cosmic-blue transition-colors">Collaborators</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold mb-3 text-space-100">Support</h5>
              <ul className="space-y-2 text-sm text-space-400">
                <li><Link href="/contact" className="hover:text-cosmic-blue transition-colors">Contact Us</Link></li>
                <li><a href="mailto:support@zoonigia.com" className="hover:text-cosmic-blue transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-space-400 pt-6 border-t border-space-600">
            <p>&copy; 2025 Zoonigia Pvt Ltd. All rights reserved. To the stars and beyond!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
