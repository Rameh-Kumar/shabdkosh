import React from 'react';
import { Brain, Cloud, Zap, Globe, Heart, History } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Discover what makes Shabdkosh the ultimate dictionary companion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Brain className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">AI-Powered Definitions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get comprehensive definitions powered by advanced AI technology, providing deeper understanding and context.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Cloud className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Offline Access</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Save words for offline access and continue learning even without an internet connection.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Zap className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Quick Search</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fast and intuitive search with real-time suggestions and comprehensive results.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Globe className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Word Relationships</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore connections between words with interactive visualizations of synonyms and related terms.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Heart className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Favorites</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Save your favorite words for quick access and create your personal vocabulary list.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <History className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
          <h2 className="text-2xl font-bold mb-4">Search History</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Keep track of your searches and easily revisit previously looked-up words.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Join thousands of users who are already enhancing their vocabulary with Shabdkosh.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md">
          Try Shabdkosh Now
        </button>
      </div>
    </div>
  );
};

export default FeaturesPage;