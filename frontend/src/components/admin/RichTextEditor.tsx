'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  height = 300,
  readOnly = false,
  error,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="relative">
        {/* Simple toolbar for basic formatting */}
        {!readOnly && (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-300 border-b-0 rounded-t-lg">
            <div className="text-xs text-gray-500 font-medium">
              Rich text editor (Markdown supported)
            </div>
          </div>
        )}
        
        {/* Textarea with enhanced styling */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`
            w-full border border-gray-300 rounded-lg
            ${!readOnly ? 'rounded-t-none' : 'rounded-lg'}
            p-4 text-sm leading-relaxed font-mono
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none transition-colors duration-200
            ${readOnly ? 'bg-gray-50 text-gray-700' : 'bg-white'}
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
          `}
          style={{ height: height }}
          spellCheck="true"
        />
        
        {/* Helper text */}
        {!readOnly && (
          <div className="mt-2 text-xs text-gray-500">
            Supports Markdown formatting: **bold**, *italic*, [links](url), lists, etc.
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}