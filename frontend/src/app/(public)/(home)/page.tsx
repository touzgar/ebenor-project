'use client';

import { Header } from '@/components/premium/Header';
import { HeroVideo } from '@/components/premium/HeroVideo';
import { About } from '@/components/premium/About';
import { FactoryShowcase } from '@/components/premium/FactoryShowcase';
import { Products } from '@/components/premium/Products';
import { WoodCatalog } from '@/components/premium/WoodCatalog';
import { Gallery } from '@/components/premium/Gallery';
import { Process } from '@/components/premium/Process';
import { CallToAction } from '@/components/premium/CallToAction';
import { Footer } from '@/components/premium/Footer';

/**
 * Homepage with SEO optimization
 * Requirements: 23.9, 23.10
 * 
 * Note: This page uses its own Header and Footer (premium versions)
 * and bypasses the layout's Navigation component to avoid duplication.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      
      <main>
        <HeroVideo />
        <About />
        <FactoryShowcase />
        <Products />
        <WoodCatalog />
        <Gallery />
        <Process />
        <CallToAction />
      </main>
      
      <Footer />
    </>
  );
}