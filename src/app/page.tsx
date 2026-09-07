import { AiPromptSection } from "@/components/landing/ai-prompt-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingBackground } from "@/components/landing/landing-background";
import { LandingNav } from "@/components/landing/landing-nav";
import { ModulesSection } from "@/components/landing/modules-section";
import { SecuritySection } from "@/components/landing/security-section";
import { SignalStrip } from "@/components/landing/signal-strip";
import { WorkflowSection } from "@/components/landing/workflow-section";

export default function HomePage() {
  return (
    <main className="life-landing min-h-dvh overflow-x-clip">
      <LandingBackground />
      <LandingNav />
      <HeroSection />
      <SignalStrip />
      <FeaturesSection />
      <ModulesSection />
      <WorkflowSection />
      <AiPromptSection />
      <SecuritySection />
      <FinalCtaSection />
    </main>
  );
}
