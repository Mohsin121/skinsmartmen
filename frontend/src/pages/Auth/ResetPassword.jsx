import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters, contain a number, uppercase letter, and special character
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 8 characters long, include a number, an uppercase letter, and a special character.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (passwordData.confirmPassword !== passwordData.newPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(passwordData.newPassword);
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#5C6748]">Reset Password</h2>
          <p className="mt-1 text-sm text-[#8C9669]">Enter your new password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-8">
          {/* New Password */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="mt-1 flex items-center">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                onBlur={() => validatePassword(passwordData.newPassword)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5C6748] focus:border-[#5C6748]"
              />
              <button
                type="button"
                className="ml-2"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 flex items-center">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                onBlur={validateConfirmPassword}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#5C6748] focus:border-[#5C6748]"
              />
              <button
                type="button"
                className="ml-2"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>}
          </div>

          {/* Submit Button */}
          <div className="space-y-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-sm font-medium text-white
                         bg-[#A2AA7B] hover:bg-[#8C9669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2AA7B] 
                         transition-colors shadow-sm"
              >
                Reset Password
              </button>

              <p className="text-center text-sm text-[#5C6748]">
                Back to{' '}
                <a href="/login" className="text-[#A2AA7B] hover:text-[#8C9669] font-medium">
                  Login
                </a>
              </p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
