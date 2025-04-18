
import React from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  skills: string[];
}

const experiences: Experience[] = [
  {
    title: 'ML Engineer',
    company: 'Next AI',
    location: 'Kathmandu, Bagmati, Nepal',
    period: '06/2024 - Present',
    description: [
      'Developed advanced AI solutions and ML models at Next AI',
      'Implemented RAG-based systems for improved information retrieval',
      'Optimized backend services with FastAPI and MongoDB'
    ],
    skills: ['Python', 'Streamlit', 'React', 'FastAPI', 'Docker', 'Qdrant', 'FAISS', 'LLMs', 'MongoDB', 'Git', 'Trello', 'Jira']
  },
  {
    title: 'Python Intern',
    company: 'Inspiring Lab',
    location: 'Lalitpur District, Nepal',
    period: '11/2023 - 03/2024',
    description: [
      'Performed data extraction and API development projects at Inspiring Lab',
      'Created automated web scraping solutions with high accuracy',
      'Implemented secure authentication systems with JWT'
    ],
    skills: ['Python', 'Selenium', 'Scrapy', 'FastAPI', 'React', 'Seaborn', 'Docker', 'pandas', 'Git']
  },
  {
    title: 'Web Developer',
    company: 'Aama chhora enterprises',
    location: 'Remote',
    period: '01/2021 - 01/2023',
    description: [
      'Worked as Web Developer focusing on delivering high-quality solutions'
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'PHP']
  }
];

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  return (
    <Card className="mb-8 bg-gray-800/60 border-gray-700 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{experience.title}</h3>
            <p className="text-blue-400 flex items-center mt-1">
              <Briefcase className="w-4 h-4 mr-2" />
              {experience.company}
            </p>
          </div>
          <div className="mt-2 md:mt-0 md:text-right">
            <p className="text-gray-300 flex items-center md:justify-end">
              <MapPin className="w-4 h-4 mr-2" />
              {experience.location}
            </p>
            <p className="text-gray-400 flex items-center md:justify-end mt-1">
              <Calendar className="w-4 h-4 mr-2" />
              {experience.period}
            </p>
          </div>
        </div>
        
        <ul className="space-y-2 mb-4">
          {experience.description.map((item, index) => (
            <li key={index} className="text-gray-300 flex">
              <span className="text-purple-400 mr-2">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {experience.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-gray-700 text-gray-200">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProfessionalJourney = () => {
  return (
    <Section id="professional-journey" className="bg-gray-900 text-white py-20">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Professional Journey
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          A track record of transforming complex technical challenges into elegant, efficient solutions
        </p>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-500/30 rounded"></div>
          
          {/* Experience cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 -top-2 w-5 h-5 rounded-full bg-blue-500"></div>
                
                {/* Card - alternating layout on desktop */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:ml-auto' : 'md:pl-8'}`}>
                  <ExperienceCard experience={exp} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ProfessionalJourney;
