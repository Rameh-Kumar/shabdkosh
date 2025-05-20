import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <Shield className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={48} />
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your privacy is important to us at Shabdkosh
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2>1. Introduction</h2>
          <p>
            At Shabdkosh ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our language learning and dictionary services ("Services").
          </p>
          <p>
            By using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Services.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our Services, including:</p>
          <h3 className="font-semibold mt-4 mb-2">Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-1 mb-4">
            <li>Account information (name, email, password)</li>
            <li>Profile information and preferences</li>
            <li>User-generated content (saved words, notes, etc.)</li>
            <li>Communications with our support team</li>
          </ul>
          <h3 className="font-semibold mt-4 mb-2">Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Search queries and history</li>
            <li>Usage data and interaction metrics</li>
            <li>Device information (type, OS, browser)</li>
            <li>IP address and approximate location</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our Services</li>
            <li>Personalize your experience and content</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to comments, questions, and requests</li>
            <li>Monitor and analyze usage and trends</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no security measures are perfect or impenetrable, and we cannot guarantee the absolute security of your data.
          </p>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
          </ul>
        </section>


      </div>
    </div>
  );
};

export default PrivacyPage;