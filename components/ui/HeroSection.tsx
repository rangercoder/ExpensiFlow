"use client";

import { Wallet } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-6">
        <div className="p-3 rounded-full bg-[#4DC9A9]/10">
          <Wallet className="w-12 h-12 text-[#4DC9A9]" />
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-[#30437A]">
        Welcome to ExpensiFlow
      </h1>
      <p className="text-xl text-[#30437A]/70 max-w-2xl mx-auto">
        Take control of your finances with smart expense tracking and powerful
        analytics
      </p>
    </div>
  );
}
