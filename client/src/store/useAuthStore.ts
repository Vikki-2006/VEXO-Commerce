import { create } from 'zustand';
import { User } from '../types';
import { useToastStore } from './useToastStore';


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('vexo_user') || 'null'),
  token: localStorage.getItem('vexo_token') || null,
  isAuthenticated: !!localStorage.getItem('vexo_token'),

  login: (user, token) => {
    localStorage.setItem('vexo_user', JSON.stringify(user));
    localStorage.setItem('vexo_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('vexo_user');
    localStorage.removeItem('vexo_token');
    useToastStore.getState().addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out of VEXO Systems.',
    });
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    localStorage.setItem('vexo_user', JSON.stringify(user));
    set({ user });
  },
}));
