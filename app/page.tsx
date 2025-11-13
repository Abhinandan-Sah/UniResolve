import ContactSection from '@/components/ContactSection';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import Universities from '@/components/Universities';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Hero />
      <Universities />
      <Partners />
      <Features />
      <ContactSection />
    </div>
  );
}
