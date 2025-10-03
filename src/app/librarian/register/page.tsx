'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LibrarianRegister() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name, 'librarian');
      router.push('/librarian/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-blue to-academic-navy flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-academic-blue">Academic Nexus</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Librarian Registration</h2>
          <p className="mt-2 text-gray-600">Create your librarian account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-academic-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-academic-blue focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Librarian Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/librarian/login" 
              className="text-academic-blue hover:text-blue-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
          <Link 
            href="/" 
            className="inline-block mt-4 text-academic-blue hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}