'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    logout: handleLogout,
  };
}
