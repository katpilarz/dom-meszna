import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Stats from '@/components/Stats';
import Statement from '@/components/Statement';
import Gallery from '@/components/Gallery';
import Interior from '@/components/Interior';
import Potential from '@/components/Potential';
import Floorplan from '@/components/Floorplan';
import Location from '@/components/Location';
import Plans from '@/components/Plans';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Header />
      <StructuredData />
      <main id="tresc">
        <Hero />
        <Marquee />
        <Stats />
        <Statement />
        <Gallery />
        <Potential />
        <Floorplan />
        <Location />
        <Interior />
        <Plans />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
