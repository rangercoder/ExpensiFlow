'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Wallet, BarChart3, Home, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { currentUser, setCurrentUser } = useUserStore();
  const router = useRouter();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/expenses',
      label: 'Expenses',
      icon: Wallet,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#4DC9A9]">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[#30437A]">ExpensiFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-[#4DC9A9]',
                      pathname === item.href
                        ? 'text-[#4DC9A9]'
                        : 'text-[#30437A]/70'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-[#30437A] hover:text-[#4DC9A9] hover:bg-[#4DC9A9]/10 transition-colors duration-300"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#4DC9A9]/30 text-[#30437A] flex items-center gap-2">
                    <span className="font-medium">{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setCurrentUser(null); router.push('/signin'); }}>
                    Sign out
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/signin')}>
                    Switch User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" className="border-[#4DC9A9]/30 text-[#30437A]" onClick={() => router.push('/signin')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}