import type { Metadata } from "next";

import { AiPromptSection } from "@/components/landing/ai-prompt-section";
import { DailyBriefingSection } from "@/components/landing/daily-briefing-section";
import { DashboardSection } from "@/components/landing/dashboard-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroCockpitSection } from "@/components/landing/hero-cockpit-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingBackground } from "@/components/landing/landing-background";
import { LandingNav } from "@/components/landing/landing-nav";
import { ModulesSection } from "@/components/landing/modules-section";
import { SecuritySection } from "@/components/landing/security-section";
import { SignalStrip } from "@/components/landing/signal-strip";
import { WorkflowSection } from "@/components/landing/workflow-section";

export const metadata: Metadata = {
  title: "Life Pilot AI",
  description: "AI-powered planning for budgets, routines, reminders, notes, and personal goals.",
};

export default function LandingPage() {
  return (
    <main className="life-landing min-h-dvh overflow-hidden text-[var(--life-text)]">
      <LandingBackground />
      <LandingNav />
      <HeroSection />
      <HeroCockpitSection />
      <DailyBriefingSection />
      <SignalStrip />
      <FeaturesSection />
      <ModulesSection />
      <WorkflowSection />
      <DashboardSection />
      <AiPromptSection />
      <SecuritySection />
      <FinalCtaSection />
    </main>
  );
}
