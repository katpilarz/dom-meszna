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
import Preloader from '@/components/Preloader';
import StructuredData from '@/components/StructuredData';
import { showcase } from '@/data/site';

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
        <Showcase
          src={showcase.src}
          alt={showcase.alt}
          caption={showcase.caption}
          position={showcase.position}
          headline={
            <span>
              {showcase.headline.lead}
              <br />
              {/* Set over a darkened photograph, so this uses the on-dark gold
                  rather than the theme accent. */}
              <span className="italic text-(--accent-on-dark)">
                {showcase.headline.accent}&nbsp;
              </span>
              {showcase.headline.tail}
            </span>
          }
          accent={showcase.accent}
        />
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
