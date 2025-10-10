'use client';

import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface FieldEditorProps {
  onAdd: (fieldName: string, fieldValue: any) => void;
  onClose: () => void;
}

type FieldType = 'string' | 'number' | 'boolean' | 'url' | 'image' | 'array' | 'object';

const FieldEditor: React.FC<FieldEditorProps> = ({ onAdd, onClose }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('string');
  const [fieldValue, setFieldValue] = useState<any>('');

  const getDefaultValue = (type: FieldType) => {
    switch (type) {
      case 'boolean':
        return false;
      case 'number':
        return 0;
      case 'array':
        return [];
      case 'object':
        return {};
      case 'string':
      case 'url':
      case 'image':
      default:
        return '';
    }
  };

  const handleTypeChange = (newType: FieldType) => {
    setFieldType(newType);
    setFieldValue(getDefaultValue(newType));
  };

  const handleAdd = () => {
    if (!fieldName.trim()) {
      alert('Please enter a field name');
      return;
    }

    // Convert field name to snake_case
    const formattedName = fieldName.trim().toLowerCase().replace(/\s+/g, '_');

    let finalValue = fieldValue;

    // Parse JSON for objects and arrays
    if (fieldType === 'object' || fieldType === 'array') {
      try {
        finalValue = JSON.parse(fieldValue || (fieldType === 'array' ? '[]' : '{}'));
      } catch (err) {
        alert('Invalid JSON format. Please check your input.');
        return;
      }
    }

    onAdd(formattedName, finalValue);
    setFieldName('');
    setFieldValue('');
    setFieldType('string');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add New Field</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Name
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g., title, description, image_url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {fieldName && (
              <p className="mt-1 text-xs text-gray-500">
                Will be saved as: <code className="bg-gray-100 px-1 py-0.5 rounded">{fieldName.trim().toLowerCase().replace(/\s+/g, '_')}</code>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Type
            </label>
            <select
              value={fieldType}
              onChange={(e) => handleTypeChange(e.target.value as FieldType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean (True/False)</option>
              <option value="url">URL</option>
              <option value="image">Image URL</option>
              <option value="array">Array (List)</option>
              <option value="object">Object (JSON)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Value
            </label>
            {fieldType === 'boolean' ? (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={fieldValue}
                  onChange={(e) => setFieldValue(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {fieldValue ? 'True' : 'False'}
                </span>
              </label>
            ) : fieldType === 'number' ? (
              <input
                type="number"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : fieldType === 'array' || fieldType === 'object' ? (
              <div>
                <textarea
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  placeholder={fieldType === 'array' ? '["item1", "item2"]' : '{"key": "value"}'}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter valid JSON format
                </p>
              </div>
            ) : (
              <input
                type="text"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                placeholder={fieldType === 'url' ? 'https://example.com' : fieldType === 'image' ? 'https://example.com/image.jpg' : 'Enter value'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Field names will be converted to snake_case automatically.
              {fieldType === 'array' && ' Arrays can store multiple items.'}
              {fieldType === 'object' && ' Objects can store nested data.'}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!fieldName.trim()}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
