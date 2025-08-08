import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface InstallBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

const InstallBanner: React.FC<InstallBannerProps> = ({ onVisibilityChange }) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      onVisibilityChange?.(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [onVisibilityChange]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
      onVisibilityChange?.(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Download className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-gray-700 dark:text-gray-300">Install Shabdkosh for a better experience</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowInstallPrompt(false);
              onVisibilityChange?.(false);
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;