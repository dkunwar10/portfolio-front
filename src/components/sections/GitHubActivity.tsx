
import React from 'react';
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Section from "@/components/common/Section";
import Container from "@/components/common/Container";
import { ContributionsChart } from "./ContributionsChart";

const GitHubActivity = () => {
  return (
    <Section id="github-activity" className="bg-gray-900">
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            GitHub Activity
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A visual representation of my open source contributions and coding activity
          </p>
        </motion.div>

        <ContributionsChart />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Button 
            variant="default" 
            size="lg" 
            asChild
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <a href="https://github.com/witcher9591" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              View GitHub Profile
            </a>
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
};

export default GitHubActivity;
