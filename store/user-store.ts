import { create } from 'zustand';

export interface User {
  userId: number;
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
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      let users = await res.json();
      users = users.map((u: any) => ({ ...u, userId: Number(u.userId) }));
      set({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },

  createUser: async (name: string) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    let user = await res.json();
    user = { ...user, userId: Number(user.userId) };
    set((state) => ({ users: [...state.users, user], currentUser: user }));
  },

  setCurrentUser: (user: any) => set({ currentUser: user ? { ...user, userId: Number(user.userId) } : null }),
})); 