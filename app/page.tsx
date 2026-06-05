import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Stats from '@/components/Stats';
import Statement from '@/components/Statement';
import Showcase from '@/components/Showcase';
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

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Statement />
        <Gallery />
        <Interior />
        <Potential />
        <Showcase
          src="/images/house/house-03.jpg"
          alt="Bryła domu — detal architektoniczny"
          caption="Architektura"
          position="top"
          headline={
            <span>
              Kolumny, kamień.
              <br />
              <span className="italic" style={{ color: '#d4a76a' }}>
                Klasyka&nbsp;
              </span>
              która się broni
            </span>
          }
          accent="Projekt: Studio Atrium, Bielsko-Biała. Keramzyt, wełna 20 cm, ceramiczna dachówka."
        />
        <Floorplan />
        <Location />
        <Plans />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
