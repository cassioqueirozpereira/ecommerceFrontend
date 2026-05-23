import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  roles?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        let decodedUser = { ...user };
        try {
          const payload = parseJwt(token);
          if (payload) {
            const rolesList = payload.roles ? payload.roles.split(',') : [];
            decodedUser = {
              id: payload.userId || user.id,
              email: payload.sub || user.email,
              firstName: user.firstName || payload.sub?.split('@')[0] || 'User',
              lastName: user.lastName || '',
              role: rolesList.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER',
              roles: rolesList,
            };
          }
        } catch (e) {
          console.error("Erro ao decodificar token JWT:", e);
        }
        set({ user: decodedUser, token, isAuthenticated: true });
      },
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
