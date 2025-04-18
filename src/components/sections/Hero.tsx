
import React from 'react';
import { useProfile } from '@/store/ProfileContext';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { profileData, loading } = useProfile();

  if (loading || !profileData) {
    return (
      <Section id="hero" className="bg-gray-900 text-white">
        <Container className="flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-800 animate-pulse rounded mb-4 mx-auto"></div>
            <div className="h-4 w-64 bg-gray-800 animate-pulse rounded mb-8 mx-auto"></div>
          </div>
        </Container>
      </Section>
    );
  }

  const { name, headline, summary, Urls } = profileData.profile;

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: Urls.find(u => u.name === 'GitHub')?.url },
    { name: 'LinkedIn', icon: Linkedin, url: Urls.find(u => u.name === 'LinkedIn')?.url },
    { name: 'Email', icon: Mail, url: Urls.find(u => u.name === 'Email')?.url },
    { name: 'Website', icon: ExternalLink, url: Urls.find(u => u.name === 'Website')?.url },
  ].filter(link => link.url);

  return (
    <Section id="hero" className="bg-gray-900 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-6xl font-bold mb-4">
            {name}
          </h1>
          <p className="text-gray-300 text-xl mb-6">{headline}</p>
          
          <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm mb-8">
            <p className="text-gray-300 whitespace-pre-line">
              {summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {socialLinks.map((link) => (
              <a href={link.url} key={link.name} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Button>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
