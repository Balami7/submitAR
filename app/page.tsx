import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import HowItWorks from '@/components/Howitworks';
import Pricing from '@/components/Pricing';
import TrackOrder from '@/components/TrackOrder';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
      <TrackOrder />
      <Footer />
    </main>
  );
}