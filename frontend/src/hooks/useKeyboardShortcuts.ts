import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}

/**
 * Hook for managing keyboard shortcuts
 *
 * @example
 * useKeyboardShortcuts([
 *   {
 *     key: 's',
 *     ctrl: true,
 *     meta: true, // Cmd on Mac, Ctrl on Windows/Linux
 *     callback: () => handleSave(),
 *     preventDefault: true,
 *   },
 *   {
 *     key: 'p',
 *     ctrl: true,
 *     meta: true,
 *     callback: () => handlePreview(),
 *     preventDefault: true,
 *   },
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl === undefined || e.ctrlKey === shortcut.ctrl;
        const metaMatches = shortcut.meta === undefined || e.metaKey === shortcut.meta;
        const shiftMatches = shortcut.shift === undefined || e.shiftKey === shortcut.shift;
        const altMatches = shortcut.alt === undefined || e.altKey === shortcut.alt;

        if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
          if (shortcut.preventDefault) {
            e.preventDefault();
          }
          shortcut.callback(e);
        }
      });
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Common keyboard shortcuts for CMS editors
 */
export const createEditorShortcuts = ({
  onSave,
  onPreview,
  onPublish,
}: {
  onSave?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [];

  if (onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      meta: true,
      callback: () => onSave(),
      preventDefault: true,
    });
  }

  if (onPreview) {
    shortcuts.push({
      key: 'p',
      ctrl: true,
      meta: true,
      callback: () => onPreview(),
      preventDefault: true,
    });
  }

  if (onPublish) {
    shortcuts.push({
      key: 'Enter',
      ctrl: true,
      meta: true,
      callback: () => onPublish(),
      preventDefault: true,
    });
  }

  return shortcuts;
};
