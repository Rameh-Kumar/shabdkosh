import React from 'react';
import { BookOpen, Award, Users, Globe, Sparkles, Brain, Zap, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6 relative">
          <Sparkles className="text-purple-600 dark:text-purple-400" size={32} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Redefining Language with AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          ShabdkoshAI is your intelligent companion for mastering language. We blend traditional lexicography with cutting-edge Artificial Intelligence.
        </p>
      </div>

      {/* Stats/Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <FeatureCard
          icon={<Brain className="w-8 h-8 text-indigo-500" />}
          title="AI-Powered"
          description="Context-aware definitions and real-time usage examples powered by Gemini."
        />
        <FeatureCard
          icon={<Globe className="w-8 h-8 text-purple-500" />}
          title="Global Access"
          description="Breaking language barriers with instant translations and offline support."
        />
        <FeatureCard
          icon={<Heart className="w-8 h-8 text-pink-500" />}
          title="User Centric"
          description="Designed for learners, writers, and word enthusiasts everywhere."
        />
      </div>

      {/* Story Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              In an increasingly connected world, clear communication is paramount. We envision a future where access to linguistic knowledge is seamless, personalized, and intelligent.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              ShabdkoshAI goes beyond simple definitions. By understanding context, nuance, and usage, we help you not just find words, but <strong>own</strong> them.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                    <Zap size={16} /> <span>AI Analysis</span>
                  </div>
                  <div className="h-3 bg-indigo-200 dark:bg-indigo-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team/Values */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-12">Crafted with Passion</h2>
        <div className="inline-flex flex-wrap justify-center gap-8">
          <ValueItem icon={<Award />} label="Excellence" />
          <ValueItem icon={<Users />} label="Community" />
          <ValueItem icon={<BookOpen />} label="Knowledge" />
          <ValueItem icon={<Zap />} label="Innovation" />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl inline-block">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const ValueItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-md text-indigo-600 dark:text-indigo-400">
      {icon}
    </div>
    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
  </div>
);

export default AboutPage;