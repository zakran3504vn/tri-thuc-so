'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './home/HeroSection';
import SubjectHighlight from './home/SubjectHighlight';
import NewsSection from './home/NewsSection';
import StatsSection from './home/StatsSection';
import FeaturedBooks from './home/FeaturedBooks';
import CTASection from './home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <SubjectHighlight />
        <FeaturedBooks />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
