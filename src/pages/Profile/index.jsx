import React, { useState } from 'react';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (123) 456-7890'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement profile update logic
    console.log('Profile Updated', profileData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#5C6748] mb-6">
        Profile Information
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#5C6748] mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#5C6748] mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5C6748] mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#5C6748] mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#A2AA7B] text-white py-2 rounded-lg hover:bg-[#8C9669] transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;