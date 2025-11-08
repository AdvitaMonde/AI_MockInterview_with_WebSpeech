'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Eye, EyeOff } from 'lucide-react';
import { signUpUser } from '@/services/signup';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   setErrors({});

  //   const response = await signUpUser(formData);

  //   if (response.success) {
  //     console.log('Signup successful:', response.user?.uid);
  //     router.push('/');
  //   } else {
  //     console.error('Signup failed:', response.error);
  //     setErrors({ general: response.error });
  //   }

  //   setIsLoading(false);
  // };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    const response = await signUpUser(formData); // Calls Firebase service

    if (response.success) {
      console.log("Signup successful:", response.user?.uid);

      // Store minimal data in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        username: formData.username,
        email: formData.email
      }));

      router.push('/'); // Redirect after successful signup
    } else {
      console.error('Signup failed:', response.error);
      setErrors({ general: response.error });
    }
  } catch (err: any) {
    setErrors({ general: err.message });
  } finally {
    setIsLoading(false);
  }
};



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">PrepWise</h1>
          </div>
          <p className="text-gray-300">Create your account to get started</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

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

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'focus:border-purple-500'
                }`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}

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
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <div className="text-center">
                <p className="text-gray-300">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium">
                    Sign In
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

















// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Mic, Eye, EyeOff } from 'lucide-react';
// import { signUpUser } from '@/services/signup';

// export default function SignUp() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState<{[key: string]: string}>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const validateForm = () => {
//     const newErrors: {[key: string]: string} = {};

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsLoading(true);

//     const response = await signUpUser(formData);

//     if (response.success) {
//        router.push('/');
//      } else {
//       setErrors({ general: response.error });
//      }


//     // Simulate API call
//     setTimeout(() => {
//       const users = JSON.parse(localStorage.getItem('users') || '[]');
      
//       // Check if user already exists
//       const existingUser = users.find((u: any) => 
//         u.username === formData.username || u.email === formData.email
//       );

//       if (existingUser) {
//         setErrors({ 
//           general: existingUser.username === formData.username 
//             ? 'Username already exists' 
//             : 'Email already exists' 
//         });
//         setIsLoading(false);
//         return;
//       }

//       // Add new user
//       users.push(formData);
//       localStorage.setItem('users', JSON.stringify(users));
      
//       // Auto sign in
//       localStorage.setItem('currentUser', JSON.stringify({
//         username: formData.username,
//         email: formData.email
//       }));
      
//       router.push('/');
//     }, 1000);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center space-x-2 mb-4">
//             <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
//               <Mic className="w-6 h-6 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-white">PrepWise</h1>
//           </div>
//           <p className="text-gray-300">Create your account to get started</p>
//         </div>

//         <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-white text-center">Sign Up</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {errors.general && (
//                 <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded">
//                   {errors.general}
//                 </div>
//               )}

//               <div>
//                 <Input
//                   type="text"
//                   name="username"
//                   placeholder="Username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 ${
//                     errors.username ? 'border-red-500' : 'focus:border-purple-500'
//                   }`}
//                 />
//                 {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
//               </div>

//               <div>
//                 <Input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 ${
//                     errors.email ? 'border-red-500' : 'focus:border-purple-500'
//                   }`}
//                 />
//                 {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
//               </div>

//               <div className="relative">
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-10 ${
//                     errors.password ? 'border-red-500' : 'focus:border-purple-500'
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//                 {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//               >
//                 {isLoading ? 'Creating Account...' : 'Sign Up'}
//               </Button>

//               <div className="text-center">
//                 <p className="text-gray-300">
//                   Already have an account?{' '}
//                   <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium">
//                     Sign In
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }