import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DefinitionPage from '../pages/DefinitionPage';
import FavoritesPage from '../pages/FavoritesPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
// Hidden pages - keeping the code for future use
// import HistoryPage from '../pages/HistoryPage';
// import OfflinePage from '../pages/OfflinePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FeaturesPage from '../pages/FeaturesPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/word/:word" element={<DefinitionPage />} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      {/* Hidden pages - keeping the code for future use
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/offline" element={<OfflinePage />} />
      */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;