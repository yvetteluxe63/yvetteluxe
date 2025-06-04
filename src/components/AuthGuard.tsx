
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectTo = '/auth' }) => {
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.loading && !state.user) {
      navigate(redirectTo);
    }
  }, [state.loading, state.user, navigate, redirectTo]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AuthGuard;
