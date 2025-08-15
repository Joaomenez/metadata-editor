import React, { useState } from 'react';
import { X, Database, Type, Shield } from 'lucide-react';
import CustomMetadataEditor from './CustomMetadataEditor';

const ColumnDetailModal = ({ column, customGroups, onSave, onClose }) => {
  const [editedColumn, setEditedColumn] = useState({ ...column });

  const handleFieldChange = (field, value) => {
    setEditedColumn({
      ...editedColumn,
      [field]: value
    });
  };

  const handleCustomMetadataChange = (groupName, data) => {
    setEditedColumn({
      ...editedColumn,
      customMetadata: {
        ...editedColumn.customMetadata,
        [groupName]: data
      }
    });
  };

  const handleSave = () => {
    onSave(editedColumn);
  };

  const certificationOptions = ['DRAFT', 'VERIFIED', 'DEPRECATED'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-atlan-blue-100 rounded-lg">
              <Database className="w-5 h-5 text-atlan-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Column Metadata
              </h2>
              <p className="text-sm text-gray-500">
                {editedColumn.name} ({editedColumn.dataType})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Column Name
                </label>
                <input
                  type="text"
                  value={editedColumn.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Type
                </label>
                <input
                  type="text"
                  value={editedColumn.dataType}
                  onChange={(e) => handleFieldChange('dataType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editedColumn.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                placeholder="Enter column description..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Description
              </label>
              <textarea
                value={editedColumn.userDescription || ''}
                onChange={(e) => handleFieldChange('userDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                placeholder="Enter business description..."
              />
            </div>
          </div>

          {/* Column Properties */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Type className="inline w-5 h-5 mr-2 text-gray-600" />
              Column Properties
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Status
                </label>
                <select
                  value={editedColumn.certificateStatus || ''}
                  onChange={(e) => handleFieldChange('certificateStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                >
                  <option value="">Select status...</option>
                  {certificationOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Users
                </label>
                <input
                  type="text"
                  value={(editedColumn.ownerUsers || []).join(', ')}
                  onChange={(e) => handleFieldChange('ownerUsers', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                  placeholder="user1@company.com, user2@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Groups
                </label>
                <input
                  type="text"
                  value={(editedColumn.ownerGroups || []).join(', ')}
                  onChange={(e) => handleFieldChange('ownerGroups', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                  placeholder="DataStewards, FinanceTeam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classifications/Tags
                </label>
                <input
                  type="text"
                  value={(editedColumn.classifications || []).join(', ')}
                  onChange={(e) => handleFieldChange('classifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
                  placeholder="PII, SENSITIVE, FINANCIAL"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNullable"
                  checked={editedColumn.isNullable}
                  onChange={(e) => handleFieldChange('isNullable', e.target.checked)}
                  className="mr-2 text-atlan-blue-600 rounded focus:ring-atlan-blue-500"
                />
                <label htmlFor="isNullable" className="text-sm text-gray-700">
                  Column accepts null values
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrimaryKey"
                  checked={editedColumn.isPrimaryKey}
                  onChange={(e) => handleFieldChange('isPrimaryKey', e.target.checked)}
                  className="mr-2 text-atlan-blue-600 rounded focus:ring-atlan-blue-500"
                />
                <label htmlFor="isPrimaryKey" className="text-sm text-gray-700">
                  Primary key column
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isForeignKey"
                  checked={editedColumn.isForeignKey}
                  onChange={(e) => handleFieldChange('isForeignKey', e.target.checked)}
                  className="mr-2 text-atlan-blue-600 rounded focus:ring-atlan-blue-500"
                />
                <label htmlFor="isForeignKey" className="text-sm text-gray-700">
                  Foreign key column
                </label>
              </div>
            </div>
          </div>

          {/* Custom Metadata */}
          <CustomMetadataEditor
            assetType="Column"
            customGroups={customGroups}
            customMetadata={editedColumn.customMetadata || {}}
            onChange={handleCustomMetadataChange}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-atlan-blue text-white rounded-lg hover:bg-atlan-blue-hover"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnDetailModal;