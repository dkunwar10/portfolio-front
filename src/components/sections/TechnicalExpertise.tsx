
import React from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Database, Globe, Terminal, Upload, Workflow } from 'lucide-react';

interface Skill {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: Skill[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Technical',
    icon: Code,
    color: 'from-purple-500 to-purple-700',
    skills: [
      { name: 'Python', proficiency: 95 },
      { name: 'React', proficiency: 92 },
      { name: 'Java', proficiency: 89 },
      { name: 'PHP', proficiency: 86 }
    ]
  },
  {
    title: 'Database',
    icon: Database,
    color: 'from-green-500 to-green-700',
    skills: [
      { name: 'MongoDB', proficiency: 95 },
      { name: 'PostgreSQL', proficiency: 92 }
    ]
  },
  {
    title: 'VectorStore',
    icon: Upload,
    color: 'from-blue-500 to-blue-700',
    skills: [
      { name: 'Qdrant', proficiency: 95 },
      { name: 'FAISS', proficiency: 92 }
    ]
  },
  {
    title: 'Soft',
    icon: Globe,
    color: 'from-blue-400 to-blue-600',
    skills: [
      { name: 'Jira', proficiency: 95 },
      { name: 'Trello', proficiency: 92 }
    ]
  },
  {
    title: 'Testing',
    icon: Terminal,
    color: 'from-yellow-500 to-yellow-700',
    skills: [
      { name: 'Selenium', proficiency: 95 }
    ]
  },
  {
    title: 'Other',
    icon: Workflow,
    color: 'from-red-500 to-red-700',
    skills: [
      { name: 'Large Language Models (LLM)', proficiency: 95 },
      { name: 'Panda', proficiency: 92 },
      { name: 'Networking', proficiency: 89 },
      { name: 'CentOS', proficiency: 86 },
      { name: 'Docker', proficiency: 83 }
    ]
  }
];

const ProgressBar = ({ value, color }: { value: number; color: string }) => {
  return (
    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${color}`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

const TechnicalExpertise = () => {
  return (
    <Section id="technical-expertise" className="bg-gray-900 text-white py-20">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Technical Expertise
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          A diverse skill set honed through years of practical experience and continuous learning
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800/60 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} mr-4`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-gray-400">{skill.proficiency}%</span>
                      </div>
                      <ProgressBar value={skill.proficiency} color={category.color} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TechnicalExpertise;
