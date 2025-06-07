"use client";

import { HeroSection } from "../components/ui/HeroSection";
import { ActionCards } from "../components/ui/ActionCards";
import { KeyFeatures } from "../components/ui/Keyfeatures";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <ActionCards />
      <KeyFeatures />
    </div>
  );
}

