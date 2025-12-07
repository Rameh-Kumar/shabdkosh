import React from 'react';
import { Shield, Lock, Eye, FileText, Globe, Cookie } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
          <Shield className="text-indigo-600 dark:text-indigo-400" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Privacy Policy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We are committed to protecting your personal data and ensuring transparency in how we operate.
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
        <Section title="Introduction" icon={<Globe />}>
          <p>
            At ShabdkoshAI, accessible from shabdkoshai.in, one of our main priorities is the privacy of our visitors.
            This Privacy Policy document contains types of information that is collected and recorded by ShabdkoshAI
            and how we use it.
          </p>
        </Section>

        <Section title="Log Files" icon={<FileText />}>
          <p>
            ShabdkoshAI follows a standard procedure of using log files. These files log visitors when they visit websites.
            The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP),
            date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information
            that is personally identifiable.
          </p>
        </Section>

        <Section title="Cookies and Web Beacons" icon={<Cookie />}>
          <p>
            Like any other website, ShabdkoshAI uses "cookies". These cookies are used to store information including
            visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is
            used to optimize the users' experience by customizing our web page content based on visitors' browser type
            and/or other information.
          </p>
        </Section>

        <Section title="Google DoubleClick DART Cookie" icon={<Eye />}>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads
            to our site visitors based upon their visit to www.website.com and other sites on the internet. However,
            visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy
            Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">https://policies.google.com/technologies/ads</a>
          </p>
        </Section>

        <Section title="Advertising Priorities" icon={<Lock />}>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are
            used in their respective advertisements and links that appear on ShabdkoshAI, which are sent directly to
            users' browser. They automatically receive your IP address when this occurs. These technologies are used
            to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content
            that you see on websites that you visit.
          </p>
          <p className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/50 text-sm">
            Note that ShabdkoshAI has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </Section>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:shabdkoshai.in@gmail.com" className="text-indigo-600 hover:underline">shabdkoshai.in@gmail.com</a>.
          </p>
          <a href="/contact" className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-md">
    <div className="flex items-center gap-4 mb-6">
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

export default PrivacyPage;