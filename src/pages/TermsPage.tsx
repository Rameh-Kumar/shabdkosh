import React from 'react';
import { FileText, CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
          <FileText className="text-indigo-600 dark:text-indigo-400" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Terms of Service</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Please read these terms carefully before using our AI-powered dictionary services.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
        <Section title="1. Acceptance of Terms" icon={<CheckCircle />}>
          <p>
            By accessing and using ShabdkoshAI, you accept and agree to be bound by the terms and provisions of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </Section>

        <Section title="2. AI-Generated Content Disclaimer" icon={<AlertCircle />}>
          <p>
            Our services utilize Artificial Intelligence (AI) and the Gemini API to generate definitions, examples, and other content.
            While we strive for accuracy, AI-generated content may sometimes be incorrect, incomplete, or misleading.
            ShabdkoshAI does not guarantee the accuracy of any information provided and shall not be held liable for any
            errors or omissions. Users should verify critical information from authoritative sources.
          </p>
        </Section>

        <Section title="3. Use License" icon={<FileText />}>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on ShabdkoshAI's
            website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
            and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display;</li>
            <li>Attempt to decompile or reverse engineer any software contained on ShabdkoshAI;</li>
            <li>Remove any copyright or other proprietary notations;</li>
          </ul>
        </Section>

        <Section title="4. Limitations" icon={<XCircle />}>
          <p>
            In no event shall ShabdkoshAI or its suppliers be liable for any damages (including, without limitation, damages for
            loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials
            on our website.
          </p>
        </Section>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mt-12 flex items-start gap-4">
          <HelpCircle className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-xl font-bold mb-2">Questions?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about these Terms, please contact us at <a href="mailto:shabdkoshai.in@gmail.com" className="text-indigo-600 hover:underline">shabdkoshai.in@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <h2 className="text-2xl font-bold m-0">{title}</h2>
    </div>
    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
      {children}
    </div>
  </section>
);

export default TermsPage;