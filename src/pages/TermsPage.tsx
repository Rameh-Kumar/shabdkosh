import React from 'react';
import { FileText } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <FileText className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={48} />
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Welcome to Shabdkosh - Your AI-Powered Language Companion
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Shabdkosh ("the Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Service Description</h2>
          <p>
            Shabdkosh provides an AI-powered dictionary and language learning platform that offers word definitions, translations, pronunciations, and related language services ("Services").
          </p>
          <p>You may use our Services only for lawful purposes and in accordance with these Terms.</p>
        </section>

        <section className="mb-8">
          <h2>3. User Account</h2>
          <p>To access certain features, you may be required to create an account. By creating an account, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 my-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Be at least 13 years of age or have parental consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Service Modifications</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, including the availability of any feature, database, or content. We may also impose limits on certain features and services or restrict your access to parts or all of the Service without notice or liability.
          </p>
        </section>

        <section className="mb-8">
          <h2>5. Limitations</h2>
          <p>
            In no event shall Lexiai be liable for any damages arising out of the use or inability
            to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2>6. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at{' '}
            <a href="mailto:terms@lexiai.com" className="text-indigo-600 dark:text-indigo-400">
              terms@lexiai.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;