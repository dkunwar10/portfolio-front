
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLinkedInData } from '@/hooks/useLinkedInData';
import { LinkedInCertificate } from '@/services/apiService';

// Function to extract skills from certificate name
const extractSkills = (name: string): string[] => {
  // Common skills to look for in certificate names
  const skillKeywords = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
    'HTML', 'CSS', 'AWS', 'Azure', 'GCP', 'Cloud', 'DevOps', 'Docker', 'Kubernetes',
    'Machine Learning', 'ML', 'AI', 'Data Science', 'Deep Learning', 'Neural Networks',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Database',
    'Web Development', 'Mobile Development', 'Frontend', 'Backend', 'Full Stack',
    'Security', 'Networking', 'Blockchain', 'IoT', 'Agile', 'Scrum',
    'GraphQL', 'REST', 'API', 'Microservices', 'Architecture'
  ];

  // Extract skills from certificate name
  const foundSkills = skillKeywords.filter(skill =>
    name.toLowerCase().includes(skill.toLowerCase())
  );

  // If no skills found, return generic skills based on certificate type
  if (foundSkills.length === 0) {
    if (name.toLowerCase().includes('web')) return ['HTML', 'CSS', 'JavaScript'];
    if (name.toLowerCase().includes('data')) return ['Data Analysis', 'Statistics'];
    if (name.toLowerCase().includes('cloud')) return ['Cloud Computing'];
    if (name.toLowerCase().includes('security')) return ['Cybersecurity'];
    return ['Professional Development'];
  }

  return foundSkills;
};

const Certificates = () => {
  // Track if initial fetch has been done
  const initialFetchDoneRef = useRef<boolean>(false);

  // Get LinkedIn data from custom hook
  const { certificates, fetchCertificates } = useLinkedInData(false);

  // Fetch certificates on mount
  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      fetchCertificates();
      initialFetchDoneRef.current = true;
    }
  }, [fetchCertificates]);

  return (
    <Section id="certificates" className="bg-gray-900 text-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Certificates & Achievements
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional certifications and achievements that validate my expertise
          </p>
        </motion.div>

        {/* Loading state */}
        {certificates.loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading certificates...</span>
          </div>
        )}

        {/* Error state */}
        {certificates.error && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">Failed to load certificates</p>
            <Button
              variant="outline"
              onClick={fetchCertificates}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Certificates grid */}
        {!certificates.loading && !certificates.error && certificates.data && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.data.map((cert, index) => (
              <motion.div
                key={cert.credentialId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/60 border-gray-700 h-full hover:border-gray-500 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-blue-400 mr-2" />
                        <h3 className="font-semibold text-lg text-white">{cert.name}</h3>
                      </div>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          aria-label={`View certificate: ${cert.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-gray-400 text-sm">{cert.authority}</p>
                      <p className="text-gray-500 text-sm">{cert.formattedDate || `Issued ${cert.issueYear}`}</p>
                      {cert.credentialId && (
                        <p className="text-gray-600 text-xs">Credential ID: {cert.credentialId}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {/* Extract skills from certificate name */}
                      {extractSkills(cert.name).map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fallback for empty data */}
        {!certificates.loading && !certificates.error && (!certificates.data || certificates.data.length === 0) && (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">No certificates found</p>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Certificates;
