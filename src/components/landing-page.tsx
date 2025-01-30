import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import GlassContainer from "./glassContainer/GlassContainer";
import LogoCarousel from './LogoCarousel';

const brandLogos = [
  '/brands/audi.svg',
  '/brands/bmw.svg',
  '/brands/mercedes.svg',
  '/brands/toyota.svg',
  '/brands/honda.svg',
  '/brands/volkswagen.svg',
  '/brands/ford.svg',
  '/brands/chevrolet.svg',
  '/brands/hyundai.svg',
  '/brands/kia.svg',
  '/brands/nissan.svg',
  '/brands/porsche.svg',
  '/brands/ferrari.svg',
  '/brands/lamborghini.svg',
  '/brands/tesla.svg',
  '/brands/jeep.svg',
  '/brands/skoda.svg',
  '/brands/mg.svg',
  '/brands/volvo.svg',
  '/brands/bugatti.svg',
  '/brands/bentley.svg',
  '/brands/astonmartin.svg',
  '/brands/landrover.svg',
  '/brands/mini.svg',
  '/brands/peugeot.svg',
  '/brands/rollsroyce.svg',
  '/brands/suzuki.svg',
  '/brands/vector.svg',
  '/brands/mclaren.svg',
  '/brands/fiat.svg'
];

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />
        <LogoCarousel logos={brandLogos} />
        <GlassContainer />
      </main>
      <Footer />
    </div>
  );
}
