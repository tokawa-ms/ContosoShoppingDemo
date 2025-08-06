'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthUser, LoginRequest } from '@/types';
import { mockLogin, validateSession } from '@/lib/auth';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER'; payload: AuthUser | null };

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'nextshopdemo_auth_user';

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isLoading: false, error: null };
    
    case 'LOGIN_ERROR':
      return { user: null, isLoading: false, error: action.payload };
    
    case 'LOGOUT':
      return { user: null, isLoading: false, error: null };
    
    case 'LOAD_USER':
      return { user: action.payload, isLoading: false, error: null };
    
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  });

  // Load user from localStorage on component mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const user = JSON.parse(savedUser) as AuthUser;
        if (validateSession(user)) {
          dispatch({ type: 'LOAD_USER', payload: user });
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  }, [state.user]);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const result = await mockLogin(credentials);
      if (result.success && result.user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: result.error || 'ログインに失敗しました' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'ログイン処理中にエラーが発生しました' });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    isLoggedIn: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}