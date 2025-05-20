import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ui/ScrollToTop';
import { WordProvider } from './contexts/WordContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { NotificationProvider } from './contexts/NotificationContext';

import useServiceWorker from './hooks/useServiceWorker';
import './index.css'; // Ensure CSS is properly imported

function App() {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);


  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdateBanner(true);
    }
  }, [isUpdateAvailable]);

  const handleUpdateClick = () => {
    updateServiceWorker();
    setShowUpdateBanner(false);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <DatabaseProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <WordProvider>
                <Layout>
                  <AppRoutes />
                </Layout>

                {showUpdateBanner && (
                  <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex justify-between items-center z-40">
                    <div className="flex items-center">
                      <BookOpen className="mr-2" />
                      <span>A new version of Shabdkosh is available!</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowUpdateBanner(false)}
                        className="px-4 py-1 text-white hover:text-gray-200 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={handleUpdateClick}
                        className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                      >
                        Update Now
                      </button>
                    </div>
                  </div>
                )}
              </WordProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </BrowserRouter>
  );
}

export default App;