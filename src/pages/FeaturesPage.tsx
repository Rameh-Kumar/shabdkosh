import React from 'react';
import { Brain, Cloud, Zap, Globe, Heart, BookOpen } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Discover what makes Shabdkosh your ultimate language companion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Brain className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Comprehensive Definitions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Access detailed definitions, synonyms, antonyms, and usage examples in multiple languages.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Cloud className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Bilingual Support</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Seamlessly switch between languages with our powerful bilingual dictionary and translation features.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Zap className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Contextual Search</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find words in context with example sentences and common phrases for better understanding.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Globe className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Cultural Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Understand words in their cultural context with notes on usage, formality, and regional variations.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Heart className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Pronunciation Guide</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Listen to accurate pronunciations by native speakers for perfect language learning.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <BookOpen className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Word of the Day</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Expand your vocabulary daily with our featured word, complete with definitions and examples.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-lg shadow-lg text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
          Join thousands of language enthusiasts who are already expanding their vocabulary with Shabdkosh.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center bg-white text-indigo-700 hover:bg-indigo-50 font-medium px-8 py-3 rounded-md transition-colors duration-200"
        >
          Start Exploring Now
          <svg 
            className="w-5 h-5 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FeaturesPage;