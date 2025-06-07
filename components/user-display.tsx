'use client';

import { useUserStore } from '@/store/user-store';

export function UserDisplay() {
  const { currentUser } = useUserStore();
  if (!currentUser) return null;
  return (
    <div className="text-[#30437A] font-medium px-4">User: {currentUser.name}</div>
  );
} 