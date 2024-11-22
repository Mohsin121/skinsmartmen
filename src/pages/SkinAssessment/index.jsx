import React, { useState } from 'react';

const SkinAssessment = () => {
  const [formData, setFormData] = useState({
    // Basic Skin Profile
    skinType: '',
    mainConcern: '',
    specificSkinIssues: [],

    // Lifestyle Factors
    workEnvironment: '',
    stressLevel: '',
    sleepQuality: '',
    exerciseFrequency: '',
    dietType: '',

    // Grooming Specifics
    shavingFrequency: '',
    shavingMethod: '',
    razorBurnIssues: '',

    // Environmental Exposure
    sunExposure: '',
    climateType: '',

    // Skincare Habits
    currentRoutine: '',
    productUsageFrequency: '',
    skincareBudget: '',

    // Health & Wellness
    waterIntake: '',
    alcoholConsumption: '',
    smokingStatus: '',
    
    // Detailed Inputs
    additionalSkinConcerns: '',
    skinTextureDescription: ''
  });

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specificSkinIssues: checked 
        ? [...prev.specificSkinIssues, value]
        : prev.specificSkinIssues.filter(item => item !== value)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6 bg-[#F5F7E8] min-h-screen">
    <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
      <h1 className="text-3xl font-bold text-[#5C6748] mb-6 text-center">SkinSmart Men's Skin Assessment</h1>
       
        
        <form className="space-y-6">
          {/* Skin Type & Concerns Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#5C6748] mb-4">Skin Profile</h2>
            
            {/* Skin Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#5C6748] mb-2">
                Skin Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Oily', 'Dry', 'Combination', 'Normal'].map(type => (
                  <label 
                    key={type} 
                    className={`p-3 text-center border rounded-lg cursor-pointer ${
                      formData.skinType === type 
                        ? 'bg-[#A2AA7B] text-white' 
                        : 'border-[#A2AA7B] text-[#5C6748]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="skinType"
                      value={type}
                      checked={formData.skinType === type}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Main Concerns */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#5C6748] mb-2">
                Primary Skin Concern
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Aging', 'Acne', 'Uneven Tone', 'Sensitivity', 'Oiliness'].map(concern => (
                  <label 
                    key={concern} 
                    className={`p-3 text-center border rounded-lg cursor-pointer ${
                      formData.mainConcern === concern 
                        ? 'bg-[#A2AA7B] text-white' 
                        : 'border-[#A2AA7B] text-[#5C6748]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mainConcern"
                      value={concern}
                      checked={formData.mainConcern === concern}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {concern}
                  </label>
                ))}
              </div>
            </div>

            {/* Specific Skin Issues */}
            <div>
              <label className="block text-sm font-medium text-[#5C6748] mb-2">
                Specific Skin Issues
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Blackheads', 'Whiteheads', 'Razor Burn', 'Dark Circles', 'Fine Lines'].map(issue => (
                  <label 
                    key={issue} 
                    className={`p-2 flex items-center border rounded-lg cursor-pointer ${
                      formData.specificSkinIssues.includes(issue) 
                        ? 'bg-[#A2AA7B] text-white' 
                        : 'border-[#A2AA7B] text-[#5C6748]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={issue}
                      checked={formData.specificSkinIssues.includes(issue)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    {issue}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Grooming & Lifestyle Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#5C6748] mb-4">Grooming & Lifestyle</h2>
            
            {/* Shaving Details */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#5C6748] mb-2">
                Shaving Frequency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Daily', 'Every Other Day', '2-3 Times/Week', 'Once a Week'].map(freq => (
                  <label 
                    key={freq} 
                    className={`p-3 text-center border rounded-lg cursor-pointer ${
                      formData.shavingFrequency === freq 
                        ? 'bg-[#A2AA7B] text-white' 
                        : 'border-[#A2AA7B] text-[#5C6748]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shavingFrequency"
                      value={freq}
                      checked={formData.shavingFrequency === freq}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {freq}
                  </label>
                ))}
              </div>
            </div>

            {/* Work & Environment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#5C6748] mb-2">
                Work Environment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Indoor', 'Outdoor', 'Mixed'].map(env => (
                  <label 
                    key={env} 
                    className={`p-3 text-center border rounded-lg cursor-pointer ${
                      formData.workEnvironment === env 
                        ? 'bg-[#A2AA7B] text-white' 
                        : 'border-[#A2AA7B] text-[#5C6748]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="workEnvironment"
                      value={env}
                      checked={formData.workEnvironment === env}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {env}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Open-Ended Additional Information */}
          <div>
            <label htmlFor="additionalSkinConcerns" className="block text-sm font-medium text-[#5C6748] mb-2">
              Additional Skin Concerns or Notes
            </label>
            <textarea
              id="additionalSkinConcerns"
              name="additionalSkinConcerns"
              rows={3}
              value={formData.additionalSkinConcerns}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
              placeholder="Share any additional skin concerns or specific requirements..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#A2AA7B] text-white py-2 rounded-lg hover:bg-[#8C9669] transition-colors"
          >
            Complete Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkinAssessment;