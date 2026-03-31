import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-red-500 font-serif mb-4">বাংলা নিউজ</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              আমরা সবসময় সত্য ও বস্তুনিষ্ঠ সংবাদ পরিবেশন করতে প্রতিশ্রুতিবদ্ধ। আমাদের সাথে থাকুন এবং সর্বশেষ খবরের আপডেট পান।
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">বিভাগসমূহ</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/?category=রাজনীতি" className="hover:text-white">রাজনীতি</Link></li>
              <li><Link to="/?category=খেলাধুলা" className="hover:text-white">খেলাধুলা</Link></li>
              <li><Link to="/?category=বিনোদন" className="hover:text-white">বিনোদন</Link></li>
              <li><Link to="/?category=প্রযুক্তি" className="hover:text-white">প্রযুক্তি</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">যোগাযোগ</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>ইমেইল: info@banglanews.com</li>
              <li>ফোন: +৮৮০ ১২৩৪ ৫৬৭৮৯০</li>
              <li>ঠিকানা: ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} বাংলা নিউজ পোর্টাল। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};
