import React, { useState } from 'react';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    // Implement password change logic
    console.log('Password Change Submitted');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#5C6748] mb-6">
        Change Password
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#5C6748] mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5C6748] mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5C6748] mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#A2AA7B] text-white py-2 rounded-lg hover:bg-[#8C9669] transition-colors"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Settings;