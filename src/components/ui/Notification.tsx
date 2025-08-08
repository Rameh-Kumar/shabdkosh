import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { NotificationType } from '../../contexts/NotificationContext';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    info: <Info className="text-blue-500" size={20} />,
    success: <CheckCircle className="text-green-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />
  };

  const bgColors = {
    info: 'bg-blue-50 dark:bg-blue-900/20',
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    error: 'bg-red-50 dark:bg-red-900/20'
  };

  const textColors = {
    info: 'text-blue-800 dark:text-blue-200',
    success: 'text-green-800 dark:text-green-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    error: 'text-red-800 dark:text-red-200'
  };

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-lg ${bgColors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className={`ml-3 ${textColors[type]}`}>{message}</div>
      <button
        onClick={onClose}
        className="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;