import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#E6EAD3] via-white to-[#D1D9B3] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C5D1A5] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 left-20 w-48 h-48 bg-[#D7E0BD] rounded-full blur-3xl opacity-40"></div>
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-8 w-full max-w-6xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#5C6748] mb-2">SkinSmart</h1>
            <p className="text-[#7C8A5F]">Create Your Personalized Skincare</p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5C6748] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5C6748] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8A5F]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#5C6748] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
                placeholder="Repeat your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#A2AA7B] text-white py-2 rounded-lg hover:bg-[#8C9669] transition-colors"
            >
              Create Account
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-[#7C8A5F]">
              Already have an account?{' '}
              <a href="#" className="text-[#5C6748] hover:text-[#A2AA7B] font-semibold">
                Log In
              </a>
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <img src="/ai-signup.jpg" alt="AI Assistant" className="rounded-[20px]" />
        </div>
      </div>
    </div>
  );
};

export default Signup;