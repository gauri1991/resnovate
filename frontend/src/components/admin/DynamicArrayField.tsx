'use client';

import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DynamicArrayFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  addButtonText?: string;
  helpText?: string;
  maxItems?: number;
  minItems?: number;
  validation?: any;
}

export default function DynamicArrayField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Add item...',
  addButtonText = 'Add',
  helpText,
  maxItems,
  minItems = 0,
  validation,
}: DynamicArrayFieldProps<T>) {
  const [newItem, setNewItem] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({ field, fieldState }) => {
        const items = (field.value || []) as string[];

        const addItem = () => {
          if (!newItem.trim()) return;
          if (maxItems && items.length >= maxItems) {
            alert(`Maximum ${maxItems} items allowed`);
            return;
          }

          field.onChange([...items, newItem.trim()]);
          setNewItem('');
        };

        const removeItem = (index: number) => {
          if (minItems && items.length <= minItems) {
            alert(`Minimum ${minItems} items required`);
            return;
          }
          field.onChange(items.filter((_, i) => i !== index));
        };

        const handleKeyPress = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
          }
        };

        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {minItems > 0 && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* List of existing items */}
            <div className="space-y-2 mb-3">
              {items.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No items added yet</p>
              ) : (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex-1 text-sm text-gray-700 break-words">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove item"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new item */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={maxItems ? items.length >= maxItems : false}
              />
              <button
                type="button"
                onClick={addItem}
                disabled={!newItem.trim() || (maxItems ? items.length >= maxItems : false)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                {addButtonText}
              </button>
            </div>

            {/* Help text and validation */}
            {helpText && !fieldState.error && (
              <p className="mt-2 text-xs text-gray-500">{helpText}</p>
            )}
            {fieldState.error && (
              <p className="mt-2 text-xs text-red-600">{fieldState.error.message}</p>
            )}
            {maxItems && (
              <p className="mt-1 text-xs text-gray-500">
                {items.length} / {maxItems} items
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
