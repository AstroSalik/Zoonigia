import { Link } from "wouter";
import { Rocket, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-space-800 py-12 border-t border-space-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Rocket className="w-6 h-6 text-cosmic-blue" />
              <h3 className="text-xl font-space font-bold text-space-50">Zoonigia</h3>
            </div>
            <p className="text-space-300 mb-4">
              Empowering future innovators and explorers through immersive science education.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cosmic-blue hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-cosmic-blue hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-cosmic-blue hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-cosmic-blue hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
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
        
        <div className="border-t border-space-600 mt-8 pt-8 text-center text-space-400">
          <p>&copy; 2025 Zoonigia. All rights reserved. To the stars and beyond!</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
