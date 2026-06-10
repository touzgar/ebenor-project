'use client';

import { Header } from '@/components/premium/Header';
import { HeroVideo } from '@/components/premium/HeroVideo';
import { FactoryShowcase } from '@/components/premium/FactoryShowcase';
import { Products } from '@/components/premium/Products';
import { WoodCatalog } from '@/components/premium/WoodCatalog';
import { Gallery } from '@/components/premium/Gallery';
import { Process } from '@/components/premium/Process';
import { CallToAction } from '@/components/premium/CallToAction';
import { Footer } from '@/components/premium/Footer';

/**
 * Homepage with premium design
 * Requirements: 23.9, 23.10
 * 
 * This page uses custom premium Header and Footer components
 * and handles its own complete page structure.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroVideo />
        <FactoryShowcase />
        <Products />
        <WoodCatalog />
        <Gallery />
        <Process />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
}