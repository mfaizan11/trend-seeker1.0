// This file is being removed as Firebase Auth functionality is disabled.
// To re-enable, restore this file and its dependencies.
import type { ReactNode } from 'react';

// Minimal placeholder to avoid breaking imports if any exist, though ideally they should be removed.
const AuthContextDisabled = ({ children }: { children: ReactNode }) => {
  console.warn("AuthProvider is currently disabled as Firebase Auth is removed.");
  return <>{children}</>;
};

export const AuthProvider = AuthContextDisabled;

export const useAuth = () => {
  // console.warn("useAuth is currently disabled as Firebase Auth is removed.");
  return {
    user: null,
    loading: false,
    signOut: async () => { /* no-op */ },
    isFirebaseConfigured: false,
  };
};
