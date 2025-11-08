'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import  {auth} from '@/firebase/client';

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email:''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.username === formData.username && u.password === formData.password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
          username: user.username,
          email: user.email
        }));
        router.push('/');
      } else {
        setErrors({ general: 'Invalid username or password' });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  setIsLoading(true);
  setErrors({});

  try {
    const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);

    localStorage.setItem('currentUser', JSON.stringify({
      email: userCredential.user.email,
      uid: userCredential.user.uid
    }));

    router.push('/');
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      setErrors({ general: 'No account found with this email' });
    } else if (error.code === 'auth/wrong-password') {
      setErrors({ general: 'Incorrect password' });
    } else {
      setErrors({ general: 'Failed to sign in. Please try again.' });
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">PrepWise</h1>
          </div>
          <p className="text-gray-300">Welcome back! Sign in to continue</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              <div>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 ${
                    errors.username ? 'border-red-500' : 'focus:border-purple-500'
                  }`}
                />
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-10 ${
                    errors.password ? 'border-red-500' : 'focus:border-purple-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <p className="text-gray-300">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}