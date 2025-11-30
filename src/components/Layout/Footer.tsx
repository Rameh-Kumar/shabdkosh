import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} ShabdkoshAI. All rights reserved.
        </div>

        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Made with</span>
          <Heart size={14} className="text-pink-500 fill-pink-500" />
          <span>for word lovers</span>
        </div>

        <div className="flex space-x-4">
          <SocialLink href="https://x.com/GoatRameshSahni" icon={<Twitter size={18} />} />
          <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
          <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors transform hover:scale-110"
  >
    {icon}
  </a>
);

export default Footer;