import React from 'react';
import DynamicFieldRenderer from './DynamicFieldRenderer';

const CustomMetadataGroup = ({ group, data, onChange }) => {
  const handleFieldChange = (propertyName, value) => {
    const updatedData = {
      ...data,
      [propertyName]: value
    };
    onChange(updatedData, propertyName, value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <span className="mr-2">{group.icon}</span>
        {group.displayName}
      </h3>
      
      {group.description && (
        <p className="text-sm text-gray-600 mb-4">{group.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {group.properties.map(property => (
          <div key={property.name} className={property.type === 'text' ? 'lg:col-span-2' : ''}>
            <DynamicFieldRenderer
              property={property}
              value={data[property.name]}
              onChange={(value) => handleFieldChange(property.name, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomMetadataGroup;