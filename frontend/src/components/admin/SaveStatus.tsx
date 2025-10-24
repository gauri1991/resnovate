'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface SaveStatusProps {
  isSaving: boolean;
  lastSaved: Date | null;
  error?: string | null;
  showTimestamp?: boolean;
}

export default function SaveStatus({
  isSaving,
  lastSaved,
  error,
  showTimestamp = true,
}: SaveStatusProps) {
  const getTimeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center space-x-2">
      <AnimatePresence mode="wait">
        {isSaving && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center text-blue-600 text-sm font-medium"
          >
            <CloudArrowUpIcon className="h-4 w-4 mr-1.5 animate-pulse" />
            Saving...
          </motion.div>
        )}

        {!isSaving && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center text-red-600 text-sm font-medium"
            title={error}
          >
            <ExclamationCircleIcon className="h-4 w-4 mr-1.5" />
            Save failed
          </motion.div>
        )}

        {!isSaving && !error && lastSaved && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center text-green-600 text-sm font-medium"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1.5" />
            {showTimestamp ? (
              <>
                Saved <span className="text-gray-500 ml-1">{getTimeSince(lastSaved)}</span>
              </>
            ) : (
              'Saved'
            )}
          </motion.div>
        )}

        {!isSaving && !error && !lastSaved && (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center text-gray-400 text-sm font-medium"
          >
            <ClockIcon className="h-4 w-4 mr-1.5" />
            Unsaved changes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
