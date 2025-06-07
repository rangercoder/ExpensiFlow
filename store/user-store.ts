import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  fetchUsers: () => Promise<void>;
  createUser: (name: string) => Promise<void>;
  setCurrentUser: (user: any) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  users: [],
  currentUser: null,

  fetchUsers: async () => {
    const res = await fetch('/api/users');
    let users = await res.json();
    users = users.map((u: any) => ({ ...u, id: u.id || u._id }));
    set({ users });
  },

  createUser: async (name: string) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    let user = await res.json();
    user = { ...user, id: user.id || user._id };
    set((state) => ({ users: [...state.users, user], currentUser: user }));
  },

  setCurrentUser: (user: any) => set({ currentUser: { ...user, id: user.id || user._id } }),
})); 