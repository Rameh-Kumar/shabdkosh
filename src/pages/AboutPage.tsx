import React from 'react';
import { BookOpen, Award, Users, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Shabdkosh</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Bridging languages through AI-powered dictionary and translation services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <BookOpen className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400">
            To make language learning and understanding accessible to everyone through our comprehensive AI-powered dictionary and translation services.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Award className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We are committed to linguistic accuracy, cultural sensitivity, and making language learning an enriching experience for everyone.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-6">Why Choose Shabdkosh?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <Globe className="text-indigo-600 dark:text-indigo-400 mr-4 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold mb-2">Multilingual Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive dictionary and translation support for multiple languages, available worldwide.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Users className="text-indigo-600 dark:text-indigo-400 mr-4 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI technology provides accurate and contextual word definitions and translations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A dedicated group of language enthusiasts and technology experts working to make language learning better.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;