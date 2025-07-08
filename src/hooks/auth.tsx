import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

interface State {
  user: User | null;
}

interface Action {
  setUser(user: State["user"]): void;
  disconnect(): void;
}

type UserStore = State & Action;

/**
 * @description hook to use the authenticated user
 */
export const useAuthenticated = create(
  persist<UserStore>(
    (setter) => ({
      user: null,
      setUser: (user) => setter(() => ({ user })),
      disconnect: () => setter(() => ({ user: null })),
    }),
    {
      name: "@deep-logs/auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
