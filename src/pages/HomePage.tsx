import React from 'react'
import { HeroSection } from '../sections/HeroSection'
import { ProblemSection } from '../sections/ProblemSection'
import { SolutionSection } from '../sections/SolutionSection'
import { OwnersSection } from '../sections/OwnersSection'
import { DriversSection } from '../sections/DriversSection'
import { HowItWorksSection } from '../sections/HowItWorksSection'
import { BusinessModelSection } from '../sections/BusinessModelSection'
import { TrustSection } from '../sections/TrustSection'
import { AboutSection } from '../sections/AboutSection'
import { FinalCtaSection } from '../sections/FinalCtaSection'

interface HomePageProps {
  onOpenDiscovery: () => void
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenDiscovery }) => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Le problème */}
      <ProblemSection />

      {/* 3. La solution */}
      <SolutionSection />

      {/* 4. Pour les propriétaires */}
      <OwnersSection />

      {/* 5. Pour les chauffeurs */}
      <DriversSection />

      {/* 6. Fonctionnement cible */}
      <HowItWorksSection />

      {/* 7. Modèle économique envisagé */}
      <BusinessModelSection />

      {/* 8. Principes de confiance */}
      <TrustSection />

      {/* 9. À propos */}
      <AboutSection />

      {/* 10. CTA Final */}
      <FinalCtaSection onOpenDiscovery={onOpenDiscovery} />
    </div>
  )
}
