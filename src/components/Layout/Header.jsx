import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm p-4 flex justify-end items-center">
      <div className="relative">
        <User size={30} className="mr-3 cursor-pointer text-[#5C6748]" onClick={() => setDropdownOpen(!dropdownOpen)} />
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-[#A2AA7B] z-50">
            <div className="p-4 border-b border-[#A2AA7B] text-center">
              <h4 className="font-semibold text-[#5C6748]">John Doe</h4>
              <p className="text-sm text-gray-500">Premium User</p>
            </div>
            <div className="py-1">
              <Link to="/profile" className="flex items-center px-4 py-2 text-[#5C6748] hover:bg-gray-100 transition-colors" onClick={() => setDropdownOpen(false)}>
                <User size={16} className="mr-3" />
                Profile
              </Link>
              <button className="w-full flex items-center px-4 py-2 text-[#5C6748] hover:bg-gray-100 transition-colors" onClick={() => {/* Logout Logic */}}>
                <LogOut size={16} className="mr-3 text-red-500" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
