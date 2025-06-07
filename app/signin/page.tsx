'use client';

import { useEffect, useState } from 'react';
import { useUserStore, User } from '@/store/user-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { users, fetchUsers, createUser, setCurrentUser } = useUserStore();
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSignIn = (user: User) => {
    setCurrentUser(user);
    router.push('/');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    setLoading(true);
    await createUser(newUserName.trim());
    setLoading(false);
    setNewUserName('');
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-8">
      <Card className="border-[#4DC9A9]/20">
        <CardHeader>
          <CardTitle className="text-[#30437A] text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 text-[#30437A] font-medium">Select a user:</div>
            <div className="space-y-2">
              {users.length === 0 && <div className="text-[#30437A]/60">No users found.</div>}
              {users.map((user) => (
                <Button key={user.userId} className="w-full justify-start" variant="outline" onClick={() => handleSignIn(user)}>
                  {user.name}
                </Button>
              ))}
            </div>
          </div>
          <form onSubmit={handleCreateUser} className="space-y-2">
            <div className="text-[#30437A] font-medium">Or create a new user:</div>
            <Input
              placeholder="Enter name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="border-[#4DC9A9]/30"
              disabled={loading}
            />
            <Button type="submit" className="w-full bg-[#4DC9A9] text-white" disabled={loading || !newUserName.trim()}>
              {loading ? 'Creating...' : 'Create & Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 