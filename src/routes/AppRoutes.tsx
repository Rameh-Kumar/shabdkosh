import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage'));
const DefinitionPage = lazy(() => import('../pages/DefinitionPage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const FeaturesPage = lazy(() => import('../pages/FeaturesPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Hidden pages - keeping the code for future use
// const HistoryPage = lazy(() => import('../pages/HistoryPage'));
// const OfflinePage = lazy(() => import('../pages/OfflinePage'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-indigo-600 text-xl">Loading...</div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  );
};

export default AppRoutes;