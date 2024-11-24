import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Forgot Password Component
export const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset link sent to:', email);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#5C6748]">
            Forgot Password?
          </h2>
          <p className="mt-1 text-sm text-[#8C9669]">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#5C6748] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#A2AA7B]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                           bg-white transition-colors hover:bg-gray-50 outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-sm font-medium text-white
                       bg-[#A2AA7B] hover:bg-[#8C9669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2AA7B] 
                       transition-colors shadow-sm"
            >
              Send Reset Link
            </button>

            <p className="text-center text-sm text-[#5C6748]">
              Remember your password?{' '}
              <a href="/login" className="text-[#A2AA7B] hover:text-[#8C9669] font-medium">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword