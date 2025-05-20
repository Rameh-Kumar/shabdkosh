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
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Lexiai, you accept and agree to be bound by the terms and
            provisions of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of Lexiai for personal,
            non-commercial transitory viewing only.
          </p>
          <p>This license shall automatically terminate if you violate any of these restrictions.</p>
        </section>

        <section className="mb-8">
          <h2>3. User Account</h2>
          <p>To access certain features, you may be required to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Service Modifications</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the service
            with or without notice.
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