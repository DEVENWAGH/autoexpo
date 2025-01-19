import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Features from "./features/Features";
import HowItWorks from "./how-it-works/HowItWorks";
import Footer from "./footer/Footer";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
