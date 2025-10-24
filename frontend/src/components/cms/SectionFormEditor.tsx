'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SectionFormEditorProps {
  sectionKey: string;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

const SectionFormEditor: React.FC<SectionFormEditorProps> = ({
  sectionKey,
  content,
  onChange
}) => {
  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  const handleArrayItemChange = (field: string, index: number, itemField: string, value: any) => {
    const array = [...(content[field] || [])];
    array[index] = { ...array[index], [itemField]: value };
    onChange({ ...content, [field]: array });
  };

  const handleArrayItemAdd = (field: string, template: any) => {
    const array = [...(content[field] || [])];
    array.push(template);
    onChange({ ...content, [field]: array });
  };

  const handleArrayItemDelete = (field: string, index: number) => {
    const array = [...(content[field] || [])];
    array.splice(index, 1);
    onChange({ ...content, [field]: array });
  };

  // ===== HERO/HEADER SECTIONS =====
  if (sectionKey === 'hero' || sectionKey === 'header') {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter section title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {content.subtitle !== undefined ? 'Subtitle' : 'Description'}
          </label>
          <textarea
            value={content.subtitle || content.description || ''}
            onChange={(e) => handleFieldChange(content.subtitle !== undefined ? 'subtitle' : 'description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter description..."
          />
        </div>

        {(content.cta_text !== undefined || content.cta_link !== undefined) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.cta_text || ''}
                onChange={(e) => handleFieldChange('cta_text', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Get Started"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                value={content.cta_link || ''}
                onChange={(e) => handleFieldChange('cta_link', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/contact"
              />
            </div>
          </div>
        )}

        {content.background_image !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              value={content.background_image || ''}
              onChange={(e) => handleFieldChange('background_image', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {content.background_image && (
              <div className="mt-2">
                <img src={content.background_image} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ===== STATISTICS/METRICS SECTIONS =====
  if (sectionKey === 'stats' || sectionKey === 'metrics' || sectionKey === 'metrics_data') {
    const stats = content.stats || content.metrics || [];
    const fieldName = content.stats !== undefined ? 'stats' : 'metrics';

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our Impact by the Numbers"
            />
          </div>
        )}

        {content.subtitle !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Proven Results"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section description..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Statistics ({stats.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd(fieldName, {
                id: stats.length + 1,
                name: '',
                label: '',
                value: ''
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Stat
            </button>
          </div>

          <div className="space-y-4">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Stat #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete(fieldName, index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Label / Name
                    </label>
                    <input
                      type="text"
                      value={stat.name || stat.label || ''}
                      onChange={(e) => {
                        const updatedStat = { ...stat };
                        if (stat.name !== undefined) updatedStat.name = e.target.value;
                        if (stat.label !== undefined) updatedStat.label = e.target.value;
                        const array = [...stats];
                        array[index] = updatedStat;
                        onChange({ ...content, [fieldName]: array });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Clients Served"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={stat.value || ''}
                      onChange={(e) => handleArrayItemChange(fieldName, index, 'value', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="500+"
                    />
                  </div>
                </div>
              </div>
            ))}

            {stats.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No statistics added yet. Click "Add Stat" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== FEATURES/VALUES/CORE SERVICES SECTIONS =====
  if (sectionKey === 'features' || sectionKey === 'values' || sectionKey === 'core_services') {
    const items = content.features || content.values || content.services || [];
    const fieldName = content.features !== undefined ? 'features' :
                     content.values !== undefined ? 'values' : 'services';
    const itemLabel = fieldName === 'values' ? 'Value' :
                     fieldName === 'services' ? 'Service' : 'Feature';

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our Features"
            />
          </div>
        )}

        {content.subtitle !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Everything you need"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section description..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {itemLabel}s ({items.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd(fieldName, {
                name: '',
                description: '',
                ...(fieldName === 'services' && {
                  features: [],
                  priceRange: '',
                  duration: ''
                })
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add {itemLabel}
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{itemLabel} #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete(fieldName, index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {itemLabel} Name
                  </label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => handleArrayItemChange(fieldName, index, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`AI-Powered Analytics`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleArrayItemChange(fieldName, index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Describe the ${itemLabel.toLowerCase()}...`}
                  />
                </div>

                {fieldName === 'services' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Price Range
                        </label>
                        <input
                          type="text"
                          value={item.priceRange || ''}
                          onChange={(e) => handleArrayItemChange(fieldName, index, 'priceRange', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$50,000 - $100,000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={item.duration || ''}
                          onChange={(e) => handleArrayItemChange(fieldName, index, 'duration', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="8-12 weeks"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Features (comma-separated)
                      </label>
                      <textarea
                        value={(item.features || []).join(', ')}
                        onChange={(e) => {
                          const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                          handleArrayItemChange(fieldName, index, 'features', features);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No {itemLabel.toLowerCase()}s added yet. Click "Add {itemLabel}" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== CTA SECTIONS =====
  if (sectionKey === 'cta') {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heading <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ready to Transform Your Business?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={content.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide more details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={content.button_text || ''}
              onChange={(e) => handleFieldChange('button_text', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Get Started"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Link
            </label>
            <input
              type="text"
              value={content.button_link || ''}
              onChange={(e) => handleFieldChange('button_link', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/contact"
            />
          </div>
        </div>
      </div>
    );
  }

  // ===== MILESTONES/PROCESS STEPS SECTIONS =====
  if (sectionKey === 'milestones' || sectionKey === 'process_steps' || sectionKey === 'process') {
    const items = content.milestones || content.steps || [];
    const fieldName = content.milestones !== undefined ? 'milestones' : 'steps';
    const isTimeline = fieldName === 'milestones';

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our Journey"
            />
          </div>
        )}

        {content.subtitle !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our Process"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section description..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {isTimeline ? 'Milestones' : 'Steps'} ({items.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd(fieldName, {
                [isTimeline ? 'year' : 'step']: isTimeline ? '2024' : items.length + 1,
                title: '',
                description: ''
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add {isTimeline ? 'Milestone' : 'Step'}
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {isTimeline ? 'Milestone' : 'Step'} #{index + 1}
                  </span>
                  <button
                    onClick={() => handleArrayItemDelete(fieldName, index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {isTimeline ? 'Year' : 'Step Number'}
                    </label>
                    <input
                      type={isTimeline ? 'text' : 'number'}
                      value={item.year || item.step || ''}
                      onChange={(e) => handleArrayItemChange(fieldName, index, isTimeline ? 'year' : 'step', isTimeline ? e.target.value : parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={isTimeline ? '2024' : '1'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleArrayItemChange(fieldName, index, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Milestone title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleArrayItemChange(fieldName, index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe this milestone..."
                  />
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No {isTimeline ? 'milestones' : 'steps'} added yet. Click "Add {isTimeline ? 'Milestone' : 'Step'}" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== OVERVIEW SECTIONS =====
  if (sectionKey === 'overview') {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Section title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={content.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description..."
          />
        </div>

        {content.mission !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Statement
            </label>
            <textarea
              value={content.mission || ''}
              onChange={(e) => handleFieldChange('mission', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our mission..."
            />
          </div>
        )}

        {content.vision !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision Statement
            </label>
            <textarea
              value={content.vision || ''}
              onChange={(e) => handleFieldChange('vision', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our vision..."
            />
          </div>
        )}
      </div>
    );
  }

  // ===== FAQ SECTION =====
  if (sectionKey === 'faqs') {
    const faqs = content.faqs || [];

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Frequently Asked Questions"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Quick answers to common questions..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              FAQs ({faqs.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('faqs', { question: '', answer: '' })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('faqs', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => handleArrayItemChange('faqs', index, 'question', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="What is your question?"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer || ''}
                    onChange={(e) => handleArrayItemChange('faqs', index, 'answer', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide the answer..."
                  />
                </div>
              </div>
            ))}

            {faqs.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No FAQs added yet. Click "Add FAQ" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== OFFICE LOCATIONS =====
  if (sectionKey === 'offices') {
    const offices = content.offices || [];

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our Offices"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="We have offices around the world..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Office Locations ({offices.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('offices', { city: '', address: '', phone: '', email: '' })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Office
            </button>
          </div>

          <div className="space-y-4">
            {offices.map((office: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Office #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('offices', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    City / Location Name
                  </label>
                  <input
                    type="text"
                    value={office.city || ''}
                    onChange={(e) => handleArrayItemChange('offices', index, 'city', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <textarea
                    value={office.address || ''}
                    onChange={(e) => handleArrayItemChange('offices', index, 'address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Business St, Suite 100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={office.phone || ''}
                      onChange={(e) => handleArrayItemChange('offices', index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={office.email || ''}
                      onChange={(e) => handleArrayItemChange('offices', index, 'email', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="office@example.com"
                    />
                  </div>
                </div>
              </div>
            ))}

            {offices.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No offices added yet. Click "Add Office" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== CONTACT INFO =====
  if (sectionKey === 'contact_info') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={content.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="info@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={content.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Physical Address
          </label>
          <textarea
            value={content.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Business St, Suite 100"
          />
        </div>

        {content.hours !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
            <input
              type="text"
              value={content.hours || ''}
              onChange={(e) => handleFieldChange('hours', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Monday - Friday: 9am - 6pm"
            />
          </div>
        )}
      </div>
    );
  }

  // ===== TESTIMONIALS =====
  if (sectionKey === 'testimonials') {
    const testimonials = content.testimonials || [];

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What Our Clients Say"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="See what our clients have to say..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Testimonials ({testimonials.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('testimonials', {
                name: '',
                role: '',
                company: '',
                quote: '',
                avatar: '',
                rating: 5
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Testimonial
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Testimonial #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('testimonials', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quote / Testimonial Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={testimonial.quote || ''}
                    onChange={(e) => handleArrayItemChange('testimonials', index, 'quote', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Working with this team has been transformative..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={testimonial.name || ''}
                      onChange={(e) => handleArrayItemChange('testimonials', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={testimonial.company || ''}
                      onChange={(e) => handleArrayItemChange('testimonials', index, 'company', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={testimonial.role || ''}
                      onChange={(e) => handleArrayItemChange('testimonials', index, 'role', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="CEO"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating || 5}
                      onChange={(e) => handleArrayItemChange('testimonials', index, 'rating', parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={testimonial.avatar || ''}
                    onChange={(e) => handleArrayItemChange('testimonials', index, 'avatar', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {testimonial.avatar && (
                    <div className="mt-2">
                      <img src={testimonial.avatar} alt="Avatar" className="h-12 w-12 rounded-full border border-gray-200" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No testimonials added yet. Click "Add Testimonial" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== TEAM MEMBERS =====
  if (sectionKey === 'team') {
    const teamMembers = content.team_members || [];

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Meet Our Team"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Our talented team of experts..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Team Members ({teamMembers.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('team_members', {
                name: '',
                role: '',
                bio: '',
                image: '',
                linkedin: '',
                twitter: ''
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Team Member
            </button>
          </div>

          <div className="space-y-4">
            {teamMembers.map((member: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Team Member #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('team_members', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.name || ''}
                      onChange={(e) => handleArrayItemChange('team_members', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Role / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.role || ''}
                      onChange={(e) => handleArrayItemChange('team_members', index, 'role', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Chief Technology Officer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={member.bio || ''}
                    onChange={(e) => handleArrayItemChange('team_members', index, 'bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief biography..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={member.image || ''}
                    onChange={(e) => handleArrayItemChange('team_members', index, 'image', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                  {member.image && (
                    <div className="mt-2">
                      <img src={member.image} alt="Team member" className="h-20 w-20 rounded-lg border border-gray-200 object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={member.linkedin || ''}
                      onChange={(e) => handleArrayItemChange('team_members', index, 'linkedin', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={member.twitter || ''}
                      onChange={(e) => handleArrayItemChange('team_members', index, 'twitter', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {teamMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No team members added yet. Click "Add Team Member" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== WHY CHOOSE US (with benefits array) =====
  if (sectionKey === 'why_choose') {
    const benefits = content.benefits || [];

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Why Choose Us?"
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section description..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Benefits ({benefits.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('benefits', {
                name: '',
                description: '',
                icon: 'chart'
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Benefit
            </button>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Benefit #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('benefits', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={benefit.name || ''}
                      onChange={(e) => handleArrayItemChange('benefits', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Proven ROI"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Icon
                    </label>
                    <select
                      value={benefit.icon || 'chart'}
                      onChange={(e) => handleArrayItemChange('benefits', index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="chart">Chart (ROI/Analytics)</option>
                      <option value="cog">Cog (Technology/Process)</option>
                      <option value="lightbulb">Lightbulb (Innovation)</option>
                      <option value="shield">Shield (Security/Support)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={benefit.description || ''}
                    onChange={(e) => handleArrayItemChange('benefits', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the benefit..."
                  />
                </div>
              </div>
            ))}

            {benefits.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No benefits added yet. Click "Add Benefit" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== EDUCATIONAL CONTENT (with offerings array) =====
  if (sectionKey === 'educational') {
    const offerings = content.offerings || [];

    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Educational Content"
            />
          </div>
        )}

        {content.subtitle !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Subtitle..."
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section description..."
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Educational Offerings ({offerings.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('offerings', {
                name: '',
                description: '',
                icon: 'academic'
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Offering
            </button>
          </div>

          <div className="space-y-4">
            {offerings.map((offering: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Offering #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('offerings', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={offering.name || ''}
                      onChange={(e) => handleArrayItemChange('offerings', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Online Courses"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Icon
                    </label>
                    <select
                      value={offering.icon || 'academic'}
                      onChange={(e) => handleArrayItemChange('offerings', index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="academic">Academic Cap (Courses)</option>
                      <option value="video">Video Camera (Videos)</option>
                      <option value="book">Book (Knowledge Base)</option>
                      <option value="chart">Chart (Reports)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={offering.description || ''}
                    onChange={(e) => handleArrayItemChange('offerings', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the offering..."
                  />
                </div>
              </div>
            ))}

            {offerings.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No offerings added yet. Click "Add Offering" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== SIMPLE HEADER SECTIONS (contact_methods_header, form_section_header, emergency_contact, library, featured) =====
  if (['contact_methods_header', 'form_section_header', 'emergency_contact', 'library', 'featured', 'services_overview', 'case_studies', 'services_list', 'tools'].includes(sectionKey)) {
    return (
      <div className="space-y-6">
        {content.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section title..."
            />
          </div>
        )}

        {content.subtitle !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Subtitle..."
            />
          </div>
        )}

        {content.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Section description..."
            />
          </div>
        )}

        {content.phone !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={content.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        )}

        {content.show_all_services !== undefined && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show_all_services"
              checked={content.show_all_services || false}
              onChange={(e) => handleFieldChange('show_all_services', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="show_all_services" className="text-sm font-medium text-gray-700">
              Show All Services
            </label>
          </div>
        )}

        {content.show_featured_only !== undefined && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show_featured_only"
              checked={content.show_featured_only || false}
              onChange={(e) => handleFieldChange('show_featured_only', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="show_featured_only" className="text-sm font-medium text-gray-700">
              Show Featured Only
            </label>
          </div>
        )}

        {content.show_all !== undefined && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show_all"
              checked={content.show_all || false}
              onChange={(e) => handleFieldChange('show_all', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="show_all" className="text-sm font-medium text-gray-700">
              Show All Items
            </label>
          </div>
        )}

        {content.max_services !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Services to Display
            </label>
            <input
              type="number"
              value={content.max_services || 6}
              onChange={(e) => handleFieldChange('max_services', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        )}

        {content.max_items !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Items to Display
            </label>
            <input
              type="number"
              value={content.max_items || 3}
              onChange={(e) => handleFieldChange('max_items', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        )}

        {content.layout !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout Style
            </label>
            <select
              value={content.layout || 'grid'}
              onChange={(e) => handleFieldChange('layout', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="carousel">Carousel</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  // ===== FEATURED TOPICS DATA =====
  if (sectionKey === 'featured_topics_data') {
    const topics = content.topics || [];

    return (
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Featured Topics ({topics.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('topics', { title: '', description: '', posts: 0 })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Topic
            </button>
          </div>

          <div className="space-y-4">
            {topics.map((topic: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Topic #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('topics', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    value={topic.title || ''}
                    onChange={(e) => handleArrayItemChange('topics', index, 'title', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="AI Implementation Strategy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={topic.description || ''}
                    onChange={(e) => handleArrayItemChange('topics', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Topic description..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Number of Posts
                  </label>
                  <input
                    type="number"
                    value={topic.posts || 0}
                    onChange={(e) => handleArrayItemChange('topics', index, 'posts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            ))}

            {topics.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No topics added yet. Click "Add Topic" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== FEATURED RESOURCES DATA =====
  if (sectionKey === 'featured_resources_data') {
    const resources = content.resources || [];

    return (
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Featured Resources ({resources.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('resources', {
                title: '',
                description: '',
                type: '',
                downloadUrl: '',
                image: ''
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Resource
            </button>
          </div>

          <div className="space-y-4">
            {resources.map((resource: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Resource #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('resources', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Resource Title
                    </label>
                    <input
                      type="text"
                      value={resource.title || ''}
                      onChange={(e) => handleArrayItemChange('resources', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="2024 AI Report"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Type
                    </label>
                    <input
                      type="text"
                      value={resource.type || ''}
                      onChange={(e) => handleArrayItemChange('resources', index, 'type', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="White Paper / Webinar / Tool"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={resource.description || ''}
                    onChange={(e) => handleArrayItemChange('resources', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Resource description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Download URL
                    </label>
                    <input
                      type="url"
                      value={resource.downloadUrl || ''}
                      onChange={(e) => handleArrayItemChange('resources', index, 'downloadUrl', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={resource.image || ''}
                      onChange={(e) => handleArrayItemChange('resources', index, 'image', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {resources.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No resources added yet. Click "Add Resource" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== RESOURCE CATEGORIES DATA =====
  if (sectionKey === 'resource_categories_data') {
    const categories = content.categories || [];

    return (
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Resource Categories ({categories.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('categories', {
                name: '',
                description: '',
                count: 0,
                color: 'blue'
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Category
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Category #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('categories', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={category.name || ''}
                      onChange={(e) => handleArrayItemChange('categories', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Industry Reports"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Item Count
                    </label>
                    <input
                      type="number"
                      value={category.count || 0}
                      onChange={(e) => handleArrayItemChange('categories', index, 'count', parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={category.description || ''}
                    onChange={(e) => handleArrayItemChange('categories', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Category description..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Color
                  </label>
                  <select
                    value={category.color || 'blue'}
                    onChange={(e) => handleArrayItemChange('categories', index, 'color', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blue">Blue</option>
                    <option value="amber">Amber</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No categories added yet. Click "Add Category" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== TOOLS DATA =====
  if (sectionKey === 'tools_data') {
    const tools = content.tools || [];

    return (
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tools & Calculators ({tools.length})
            </label>
            <button
              onClick={() => handleArrayItemAdd('tools', {
                name: '',
                description: '',
                type: '',
                size: ''
              })}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Tool
            </button>
          </div>

          <div className="space-y-4">
            {tools.map((tool: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tool #{index + 1}</span>
                  <button
                    onClick={() => handleArrayItemDelete('tools', index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Tool Name
                    </label>
                    <input
                      type="text"
                      value={tool.name || ''}
                      onChange={(e) => handleArrayItemChange('tools', index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="AI ROI Calculator"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Type
                    </label>
                    <input
                      type="text"
                      value={tool.type || ''}
                      onChange={(e) => handleArrayItemChange('tools', index, 'type', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Web Tool / PDF Guide"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={tool.description || ''}
                    onChange={(e) => handleArrayItemChange('tools', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tool description..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={tool.size || ''}
                    onChange={(e) => handleArrayItemChange('tools', index, 'size', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2.5 MB / Online"
                  />
                </div>
              </div>
            ))}

            {tools.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No tools added yet. Click "Add Tool" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: Return null and use DynamicFormBuilder instead
  return null;
};

export default SectionFormEditor;
