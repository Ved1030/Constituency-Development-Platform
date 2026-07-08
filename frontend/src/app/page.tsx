import { Hero } from "@/components/landing/Hero";
import { Statistics } from "@/components/landing/Statistics";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PlatformPreview } from "@/components/landing/PlatformPreview";
import { WhyChoose } from "@/components/landing/WhyChoose";
import { Multilingual } from "@/components/landing/Multilingual";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Statistics />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <PlatformPreview />
      <WhyChoose />
      <Multilingual />
      <Testimonials />
      <CTA />
    </>
  );
}
