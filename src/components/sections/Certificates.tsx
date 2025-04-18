
import React from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const certificates = [
  {
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI",
    date: "2024",
    link: "#",
    skills: ["Python", "ML", "Neural Networks"]
  },
  {
    title: "Advanced React & GraphQL",
    issuer: "Frontend Masters",
    date: "2023",
    link: "#",
    skills: ["React", "GraphQL", "Apollo"]
  },
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    link: "#",
    skills: ["AWS", "Cloud", "Architecture"]
  }
];

const Certificates = () => {
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/60 border-gray-700 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="font-semibold text-lg text-white">{cert.title}</h3>
                    </div>
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    <p className="text-gray-500 text-sm">{cert.date}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, idx) => (
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
      </Container>
    </Section>
  );
};

export default Certificates;
