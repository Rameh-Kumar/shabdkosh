import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ui/ScrollToTop';
import { WordProvider } from './contexts/WordContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <DatabaseProvider>
        <ThemeProvider>
          <NotificationProvider>
            <WordProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </WordProvider>
          </NotificationProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </BrowserRouter>
  );
}

export default App;