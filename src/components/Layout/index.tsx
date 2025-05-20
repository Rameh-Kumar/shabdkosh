import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleShowRegister = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          closeSidebar={closeSidebar}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 transition-colors duration-200">
          {children}
        </main>
      </div>
      
      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseModals} 
        onSwitchToRegister={handleShowRegister} 
      />
      
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={handleCloseModals} 
        onSwitchToLogin={handleShowLogin} 
      />
    </div>
  );
};

export default Layout;