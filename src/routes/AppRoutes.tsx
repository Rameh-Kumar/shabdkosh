import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DefinitionPage from '../pages/DefinitionPage';
import FavoritesPage from '../pages/FavoritesPage';
import HistoryPage from '../pages/HistoryPage';
import OfflinePage from '../pages/OfflinePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/word/:word" element={<DefinitionPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/offline" element={<OfflinePage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;