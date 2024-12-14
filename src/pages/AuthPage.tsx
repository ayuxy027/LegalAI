import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Gavel, UserIcon as UserTie, User } from 'lucide-react';

type Role = 'judge' | 'lawyer' | 'user';

interface FormInputs {
  email: string;
  password: string;
  reenterPassword: string;
  role: Role;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';

  const [inputs, setInputs] = useState<FormInputs>({
    email: "",
    password: "",
    reenterPassword: "",
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isFormValid = isSignUp
    ? inputs.email && inputs.password && inputs.password === inputs.reenterPassword && inputs.role
    : inputs.email && inputs.password;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const handleRoleChange = (role: Role) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      role
    }));
  };

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulating API call
      const response: ApiResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: isSignUp ? 'Account created successfully!' : 'Logged in successfully!',
            token: 'fake-jwt-token'
          });
        }, 1500);
      });

      if (response.success) {
        setSuccessMessage(response.message);
        // Here you would typically store the token and redirect the user
        console.log('Token:', response.token);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset form when switching between login and signup
    setInputs({
      email: "",
      password: "",
      reenterPassword: "",
      role: 'user'
    });
    setError(null);
    setSuccessMessage(null);
  }, [isSignUp]);

  const roleIcons: Record<Role, React.ReactNode> = {
    judge: <Gavel className="w-5 h-5" />,
    lawyer: <UserTie className="w-5 h-5" />,
    user: <User className="w-5 h-5" />
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-3 mx-auto rounded-full bg-primary/10 w-fit"
        >
          <Scale className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-primary to-primary-dark bg-clip-text"
        >
          {isSignUp ? 'Sign Up' : 'Log In'}
        </motion.h1>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
            <input
              className="w-full py-3 pl-10 pr-3 text-sm font-medium placeholder-gray-500 transition duration-300 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-primary focus:border-primary"
              type="email" placeholder="Email address" name="email" required
              onChange={handleInputChange}
              value={inputs.email}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
            <input
              className="w-full py-3 pl-10 pr-10 text-sm font-medium placeholder-gray-500 transition duration-300 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-primary focus:border-primary"
              type={showPassword ? "text" : "password"} placeholder="Password" name="password" required
              onChange={handleInputChange}
              value={inputs.password}
            />
            <button 
              type="button"
              className="absolute text-gray-400 transition-colors duration-300 transform -translate-y-1/2 top-1/2 right-3 focus:outline-none hover:text-primary" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>
          {isSignUp && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
                <input
                  className="w-full py-3 pl-10 pr-3 text-sm font-medium placeholder-gray-500 transition duration-300 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-primary focus:border-primary"
                  type={showPassword ? "text" : "password"} placeholder="Re-Enter Password" name="reenterPassword" required
                  onChange={handleInputChange}
                  value={inputs.reenterPassword}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-gray-700">Select your role:</label>
                <div className="flex justify-between">
                  {(['judge', 'lawyer', 'user'] as Role[]).map((role) => (
                    <motion.button
                      key={role}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleChange(role)}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-primary ${
                        inputs.role === role
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {roleIcons[role]}
                        <span className="ml-2 capitalize">{role}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center space-y-4"
          >
            <button
              className={`flex items-center justify-center w-full py-3 px-4 font-semibold text-white transition-all duration-300 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 transform hover:scale-105 ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary focus:ring-primary" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleAuth}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isSignUp ? (
                <UserPlus className="w-5 h-5 mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              <span>{isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}</span>
            </button>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full p-3 text-sm font-medium text-center text-red-500 bg-red-100 border border-red-200 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full p-3 text-sm font-medium text-center text-green-500 bg-green-100 border border-green-200 rounded-lg"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-full text-center">
              <span className="px-2 text-sm text-gray-500 bg-white">Or continue with</span>
              <div className="relative mt-3 border-t border-gray-300">
                <div className="absolute inset-x-0 top-0 flex justify-center">
                  <span className="px-2 text-sm text-gray-500 bg-white">-</span>
                </div>
              </div>
            </div>
            <div className="flex w-full space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-gray-700 transition duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-3.71 1.06c-2.92 0-5.39-1.97-6.27-4.62H2.66v2.86C4.48 20.48 8.01 23 12 23z" fill="#34A853"/>
                  <path d="M5.73 14.94c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.9H2.66C1.97 9.79 1.55 11.84 1.55 14s.42 4.21 1.11 6.1l3.07-2.16z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 8.01 1 4.48 3.52 2.66 7.9l3.07 2.16c.88-2.65 3.35-4.62 6.27-4.62z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-gray-700 transition duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg className="w-5 h-5 mr-2 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <span className="text-sm text-gray-600">{isSignUp ? 'Already have an account?' : "Don't have an account?"} </span>
            <button
              className="text-sm font-semibold text-transparent transition-all duration-300 ease-in-out bg-clip-text bg-gradient-to-r from-primary to-primary-dark focus:outline-none hover:opacity-80"
              onClick={() => navigate(isSignUp ? "/login" : "/signup")}
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;