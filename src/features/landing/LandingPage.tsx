import { useState } from 'react';
import { LandingNavbar, LandingDialog, Footer, type InfoTopic } from './LandingNavigation';
import { HeroSection, MetricsStrip, FeaturesSection, LearningFlowSection, VisualizerSection, AITutorSection, CodingPracticeSection, ProgressSection, GlobalCommunitySection, TestimonialsSection, FAQSection, FinalCTA } from './LandingSections';
import { ProductShowcase } from './LandingPreviews';
import { SectionHeading } from './landingShared';
import './landing.css';
export default function LandingPage() {
  const [dialog, setDialog] = useState<InfoTopic>(null);
  return <div className="alvio-landing">
    <a className="lp-skip" href="#landing-main">Skip to content</a>
    <LandingNavbar onSearch={() => setDialog('Search')} />
    <main id="landing-main">
      <HeroSection />
      <MetricsStrip />
      <FeaturesSection />
      <LearningFlowSection />
      <section className="lp-section lp-container" id="product">
        <SectionHeading eyebrow="REAL TOOLS. REAL PROGRESS." title="Inside Alvio Academy" text="A closer look at the tools that help you learn, practice, and grow. Illustrative previews — open any tool to try it." />
        <ProductShowcase />
      </section>
      <VisualizerSection />
      <AITutorSection />
      <CodingPracticeSection />
      <ProgressSection />
      <GlobalCommunitySection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </main>
    <Footer onInfo={setDialog} />
    <LandingDialog topic={dialog} onClose={() => setDialog(null)} />
  </div>;
}
