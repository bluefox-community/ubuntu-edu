import Hero from '@/pages/home/Hero';
import PainPoints from '@/pages/home/PainPoints';
import TerminalDemo from '@/pages/home/TerminalDemo';
import LearningPath from '@/pages/home/LearningPath';
import ModulesPreview from '@/pages/home/ModulesPreview';
import Methodology from '@/pages/home/Methodology';
import Testimonials from '@/pages/home/Testimonials';
import FaqTeaser from '@/pages/home/FaqTeaser';
import FinalCta from '@/pages/home/FinalCta';

export default function Home() {
  return (
    <>
      <Hero />
      <PainPoints />
      <TerminalDemo />
      <LearningPath />
      <ModulesPreview />
      <Methodology />
      <Testimonials />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
