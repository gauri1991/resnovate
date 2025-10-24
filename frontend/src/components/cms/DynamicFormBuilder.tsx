'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface DynamicFormBuilderProps {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  onAddField?: () => void;
}

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'url' | 'image' | 'textarea';

const formatFieldLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const detectFieldType = (key: string, value: any): FieldType => {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';
  if (typeof value === 'string') {
    if (value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (value.match(/^https?:\/\/.+/i) || key.includes('link') || key.includes('url')) return 'url';
    // Auto-detect textarea fields based on key name or content length
    if (key.includes('description') || key.includes('content') || key.includes('mission') ||
        key.includes('vision') || value.length > 100) {
      return 'textarea';
    }
    return 'string';
  }
  return 'string';
};

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
  content,
  onChange,
  onAddField
}) => {
  const [expandedObjects, setExpandedObjects] = useState<Set<string>>(new Set());

  const toggleObjectExpansion = (key: string) => {
    const newExpanded = new Set(expandedObjects);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedObjects(newExpanded);
  };

  const handleFieldChange = (key: string, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const handleNestedFieldChange = (parentKey: string, childKey: string, value: any) => {
    const parentValue = content[parentKey] as Record<string, any>;
    onChange({
      ...content,
      [parentKey]: { ...parentValue, [childKey]: value }
    });
  };

  const handleArrayItemChange = (key: string, index: number, value: any) => {
    const array = [...(content[key] as any[])];
    array[index] = value;
    onChange({ ...content, [key]: array });
  };

  const handleArrayItemDelete = (key: string, index: number) => {
    const array = [...(content[key] as any[])];
    array.splice(index, 1);
    onChange({ ...content, [key]: array });
  };

  const handleArrayItemAdd = (key: string) => {
    const array = [...(content[key] as any[])];
    const lastItem = array[array.length - 1];
    const newItem = typeof lastItem === 'object' ? { ...lastItem } : '';
    array.push(newItem);
    onChange({ ...content, [key]: array });
  };

  const handleDeleteField = (key: string) => {
    const newContent = { ...content };
    delete newContent[key];
    onChange(newContent);
  };

  const renderField = (key: string, value: any) => {
    const fieldType = detectFieldType(key, value);
    const fieldId = `field-${key}`;
    const fieldLabel = formatFieldLabel(key);

    switch (fieldType) {
      case 'textarea':
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
                {fieldLabel}
              </label>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
              placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
            />
            <p className="text-xs text-gray-500">{value.length} characters</p>
          </div>
        );

      case 'boolean':
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={fieldId} className="flex items-center space-x-2 cursor-pointer">
                <input
                  id={fieldId}
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleFieldChange(key, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{fieldLabel}</span>
              </label>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
                {fieldLabel}
              </label>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <input
              id={fieldId}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'image':
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
                {fieldLabel}
              </label>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {value && (
                <div className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={value} alt={key} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  id={fieldId}
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'url':
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
                {fieldLabel}
              </label>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id={fieldId}
                type="url"
                value={value}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {value && (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Open
                </a>
              )}
            </div>
          </div>
        );

      case 'array':
        const arrayItems = value as any[];
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {fieldLabel} ({arrayItems.length} items)
              </label>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleArrayItemAdd(key)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Add item"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteField(key)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete field"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
              {arrayItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-1">
                    {typeof item === 'object' ? (
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                        {Object.entries(item).map(([nestedKey, nestedValue]) => (
                          <div key={nestedKey} className="space-y-1">
                            <label className="block text-xs font-medium text-gray-600">
                              {formatFieldLabel(nestedKey)}
                            </label>
                            <input
                              type="text"
                              value={nestedValue as string}
                              onChange={(e) => {
                                const newItem = { ...item, [nestedKey]: e.target.value };
                                handleArrayItemChange(key, index, newItem);
                              }}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayItemChange(key, index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleArrayItemDelete(key, index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete item"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'object':
        const objectEntries = Object.entries(value as Record<string, any>);
        const isExpanded = expandedObjects.has(key);
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleObjectExpansion(key)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <span>{isExpanded ? '▼' : '▶'}</span>
                <span>{fieldLabel} ({objectEntries.length} fields)</span>
              </button>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            {isExpanded && (
              <div className="ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                {objectEntries.map(([nestedKey, nestedValue]) => (
                  <div key={nestedKey} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      {formatFieldLabel(nestedKey)}
                    </label>
                    <input
                      type="text"
                      value={nestedValue as string}
                      onChange={(e) => handleNestedFieldChange(key, nestedKey, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'string':
      default:
        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
                {fieldLabel}
              </label>
              <button
                onClick={() => handleDeleteField(key)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete field"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <input
              id={fieldId}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(content).map(([key, value]) => renderField(key, value))}

      {onAddField && (
        <button
          onClick={onAddField}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add New Field</span>
        </button>
      )}
    </div>
  );
};

export default DynamicFormBuilder;
