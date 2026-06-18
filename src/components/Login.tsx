import React, { useState } from 'react';
import logoImage from '../assets/photo_2026-06-17_08-23-26.jpg';
import { User } from '../types';
import { loginAPI } from '../services/apiService';
import { setCookie } from '../utils/cookieUtils';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

interface FormErrors {
  email?: string | null;
  password?: string | null;
  form?: string | null;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await loginAPI(email, password);
      if (result.success && result.token) {
        // Store the token in cookies
        setCookie('auth_token', result.token, 7);
        
        onLoginSuccess({
          email: result.data.email,
          name: result.data.name,
        });
      } else {
        setErrors({
          form: result.message || 'Invalid email or password. Please try again.'
        });
      }
    } catch (err: any) {
      setErrors({
        form: err.message || 'Unable to connect to the authentication server. Please check if the server is running.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 to-blue-500"></div>

        {/* Logo and Header Header */}
        <div className="flex flex-col items-center">
          <img src={logoImage} alt="Clinic Logo" className="w-12 h-12 object-contain rounded-lg" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Nurse Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in to manage clinic nursing staff profiles
          </p>
        </div>

        {/* Form Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-rose-800">{errors.form}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                  className={`block w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
                  placeholder="admin@clinic.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-rose-600"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  className={`block w-full px-4 py-3 rounded-xl border ${
                    errors.password ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-rose-600"></span>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all disabled:bg-sky-300 shadow-md shadow-sky-100 hover:shadow-lg hover:shadow-sky-100 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

       

      </div>
    </div>
  );
}
