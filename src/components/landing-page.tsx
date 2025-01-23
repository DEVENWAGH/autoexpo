import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import GlassContainer from "./glassContainer/GlassContainer";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />
        <GlassContainer />
      </main>
      <Footer />
    </div>
  );
}
