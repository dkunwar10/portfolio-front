
import React, { useEffect } from 'react';
import { ProfileProvider } from '@/store/ProfileContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ProfessionalJourney from '@/components/sections/ProfessionalJourney';
import TechnicalExpertise from '@/components/sections/TechnicalExpertise';

const Index = () => {
  // Set dark background on body
  useEffect(() => {
    document.body.className = 'bg-gray-900';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <ProfileProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navigation />
        
        <main className="flex-1">
          <Hero />
          <ProfessionalJourney />
          <TechnicalExpertise />
        </main>
        
        <Footer />
      </div>
    </ProfileProvider>
  );
};

export default Index;
