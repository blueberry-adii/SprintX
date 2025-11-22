import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../src/firebase';

interface AuthPageProps {
  onLogin: () => void;
}

const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute bottom-40 right-40 w-64 h-64 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-1000"></div>
  </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Store token temporarily for the request
      localStorage.setItem('token', token);

      try {
        // Try to login
        await api.post('/auth/login', {});
      } catch (loginError: any) {
        // If user not found (404), register them
        if (loginError.message && loginError.message.includes('User not found')) {
          await api.post('/auth/register', {
            name: user.displayName,
            email: user.email,
          });
        } else {
          throw loginError;
        }
      }

      // Final success
      onLogin();
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'Authentication failed');
      localStorage.removeItem('token'); // Cleanup on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden font-sans selection:bg-sky-200 selection:text-sky-900">
      <BackgroundAnimation />

      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-fade-in relative z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-400 rounded-2xl mb-6 shadow-lg shadow-sky-500/20 transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome to StudentFlow
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sign in to continue your progress
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-3 animate-shake">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};