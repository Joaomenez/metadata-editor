import React from 'react';
import CustomMetadataGroup from './CustomMetadataGroup';
import BusinessOfferSelector from './BusinessOfferSelector';

const CustomMetadataEditor = ({ assetType, customGroups, customMetadata, onChange }) => {
  const applicableGroups = customGroups.filter(group => 
    group.applicableAssetTypes.includes(assetType)
  );

  const handleGroupChange = (groupName, data, changedPropertyName = null, changedValue = null) => {
    onChange(groupName, data, changedPropertyName, changedValue);
  };

  const regularGroups = applicableGroups.filter(group => !group.isBusinessOfferGroup);
  const businessOfferGroups = applicableGroups.filter(group => group.isBusinessOfferGroup);

  return (
    <div className="space-y-6">
      {/* Business offer groups full width - shown first */}
      {businessOfferGroups.map(group => (
        <div key={group.name} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <span className="mr-2">{group.icon}</span>
            {group.displayName}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{group.description}</p>
          
          <BusinessOfferSelector
            label="Ofertas Selecionadas"
            value={customMetadata[group.name]?.businessOffers || customMetadata[group.name] || []}
            onChange={(offers) => handleGroupChange(group.name, { businessOffers: offers }, 'businessOffers', offers)}
          />
        </div>
      ))}

      {/* Regular groups in a grid layout (side by side) - shown after */}
      {regularGroups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regularGroups.map(group => (
            <CustomMetadataGroup
              key={group.name}
              group={group}
              data={customMetadata[group.name] || {}}
              onChange={(data, changedPropertyName, changedValue) => 
                handleGroupChange(group.name, data, changedPropertyName, changedValue)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMetadataEditor;