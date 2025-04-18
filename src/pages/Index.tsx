
import React, { useEffect } from 'react';
import { ProfileProvider } from '@/store/ProfileContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ProfessionalJourney from '@/components/sections/ProfessionalJourney';
import TechnicalExpertise from '@/components/sections/TechnicalExpertise';
import Projects from '@/components/sections/Projects';
import GitHubActivity from '@/components/sections/GitHubActivity';
import { ChatWindow } from '@/components/common/ChatWindow';
import Certificates from '@/components/sections/Certificates';

const Index = () => {
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

        <main className="flex-1 md:pl-60 transition-all duration-500">
          <Hero />
          <ProfessionalJourney />
          <TechnicalExpertise />
          <Projects />
          <GitHubActivity />
          <Certificates />
        </main>

        <Footer />
        <ChatWindow />
      </div>
    </ProfileProvider>
  );
};

export default Index;
