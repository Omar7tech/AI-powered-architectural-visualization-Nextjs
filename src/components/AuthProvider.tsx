'use client';

import { useEffect, useState } from 'react';
import { AuthState } from '../types/type';
import { AuthContext } from './AuthContext';
import { getCurrentUser, signIn as puterSignIn, signOut as puterSignOut } from '../../lib/puter.action';

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  username: null,
  userId: null,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({
        isSignedIn: !!user,
        username: user?.username || null,
        userId: user?.uuid || null,
      });
      return !!user;
    } catch {
      setAuthState(DEFAULT_AUTH_STATE);
      return false;
    }
  };
  const signIn = async () => {
    await puterSignIn();
    await refreshAuth();
  };

  const signOut = async () => {
    await puterSignOut();
    await refreshAuth();
  };


  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, refreshAuth , signIn , signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
