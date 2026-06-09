'use client';

import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Components from '@/components/sections/Components';
import News from '@/components/sections/News';
import Data from '@/components/sections/Data';
import Partners from '@/components/sections/Partners';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-smas-off-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Components />
        <News />
        <Data />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}
