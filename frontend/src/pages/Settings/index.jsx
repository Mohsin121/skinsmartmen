import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password Change Submitted');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#5C6748]">
            Change Password
          </h2>
          <p className="mt-1 text-sm text-[#8C9669]">
            Update your account password
          </p>
        </div>

        {/* Form Section */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C6748] mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#A2AA7B]" />
                    </div>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                               bg-white transition-colors hover:bg-gray-50 outline-none"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? 
                        <EyeOff className="h-5 w-5 text-[#A2AA7B]" /> : 
                        <Eye className="h-5 w-5 text-[#A2AA7B]" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C6748] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#A2AA7B]" />
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                               bg-white transition-colors hover:bg-gray-50 outline-none"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? 
                        <EyeOff className="h-5 w-5 text-[#A2AA7B]" /> : 
                        <Eye className="h-5 w-5 text-[#A2AA7B]" />
                      }
                    </button>
                  </div>
                </div>

             
              </div>
            </div>

            {/* Button Section - Full Width */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-sm font-medium text-white
                         bg-[#A2AA7B] hover:bg-[#8C9669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2AA7B] 
                         transition-colors shadow-sm"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;