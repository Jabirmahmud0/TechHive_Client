import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-gray-800 mt-auto light-mode">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">TechHive</h3>
            <p className="text-text-secondary text-sm">
              Your premium destination for the latest electronics and AI-powered shopping assistance.
            </p>
          </div>
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Categories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Newsletter</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field rounded-r-none"
              />
              <button className="btn-primary rounded-l-none px-4">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} TechHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;