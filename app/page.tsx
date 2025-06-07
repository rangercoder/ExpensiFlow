"use client";

import { HeroSection } from "../components/ui/HeroSection";
import { ActionCards } from "../components/ui/ActionCards";
import { KeyFeatures } from "../components/ui/Keyfeatures";
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { currentUser } = useUserStore();
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      router.replace('/signin');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="space-y-8">
      <HeroSection />
      <ActionCards />
      <KeyFeatures />
    </div>
  );
}

