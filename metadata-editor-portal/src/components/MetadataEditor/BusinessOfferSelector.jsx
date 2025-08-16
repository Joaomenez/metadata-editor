import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, ChevronDown, Loader } from 'lucide-react';
import { businessOffers } from '../../data/mockData';

const BusinessOfferSelector = ({ label, value = [], onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const dropdownRef = useRef(null);
  
  // Debug log
  console.log('BusinessOfferSelector value:', value);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Filter offers based on search query
    if (searchQuery.length >= 2) {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const filtered = businessOffers.filter(offer =>
          offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOffers(filtered);
        setLoading(false);
      }, 300);
    } else {
      setFilteredOffers([]);
    }
  }, [searchQuery]);

  const handleAddOffer = (offer) => {
    // Check if offer is already selected
    const isAlreadySelected = value.some(v => v.IDDaOferta === offer.id);
    
    if (!isAlreadySelected) {
      const newOffer = {
        NomeDaOferta: offer.name,
        IDDaOferta: offer.id
      };
      onChange([...value, newOffer]);
    }
    
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleRemoveOffer = (offerId) => {
    onChange(value.filter(v => v.IDDaOferta !== offerId));
  };

  const getCategoryColor = (category) => {
    const colors = {
      Banking: 'bg-blue-100 text-blue-800',
      Credit: 'bg-green-100 text-green-800',
      Investment: 'bg-purple-100 text-purple-800',
      Insurance: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="ml-2 text-xs text-gray-500">
          ({value.length} selecionada{value.length !== 1 ? 's' : ''})
        </span>
      </label>

      {/* Selected Offers Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {value.map((offer) => (
            <div
              key={offer.IDDaOferta}
              className="inline-flex items-center px-3 py-1.5 bg-white rounded-full border border-gray-300 text-sm"
            >
              <Tag className="w-3 h-3 mr-2 text-atlan-blue-600" />
              <span className="font-medium">{offer.NomeDaOferta}</span>
              <span className="ml-2 text-xs text-gray-500">({offer.IDDaOferta})</span>
              <button
                onClick={() => handleRemoveOffer(offer.IDDaOferta)}
                className="ml-2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input and Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar ofertas por nome, ID ou categoria (mín. 2 caracteres)..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atlan-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Dropdown Results */}
        {isOpen && searchQuery.length >= 2 && (
          <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Loader className="w-5 h-5 animate-spin mx-auto text-atlan-blue-600" />
                <p className="text-sm text-gray-500 mt-2">Buscando ofertas...</p>
              </div>
            ) : filteredOffers.length > 0 ? (
              <ul className="py-1">
                {filteredOffers.map((offer) => {
                  const isSelected = value.some(v => v.IDDaOferta === offer.id);
                  
                  return (
                    <li
                      key={offer.id}
                      onClick={() => !isSelected && handleAddOffer(offer)}
                      className={`
                        px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0
                        ${isSelected ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {offer.name}
                            </span>
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                              ${getCategoryColor(offer.category)}
                            `}>
                              {offer.category}
                            </span>
                            {isSelected && (
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Selecionada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {offer.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {offer.id}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Nenhuma oferta encontrada para "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Helper Text */}
        {isOpen && searchQuery.length < 2 && (
          <div className="absolute z-20 w-full mt-1 bg-yellow-50 rounded-lg border border-yellow-200 p-3">
            <p className="text-xs text-yellow-800">
              Digite pelo menos 2 caracteres para buscar ofertas
            </p>
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500">
        Você pode selecionar múltiplas ofertas. As ofertas selecionadas serão salvas no Atlan.
      </p>
    </div>
  );
};

export default BusinessOfferSelector;