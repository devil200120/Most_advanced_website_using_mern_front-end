// frontend/src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  debounceDelay = 300,
  showFilters = false,
  filters = [],
  onFilterChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, selectedFilters);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedFilters, debounceDelay, onSearch]);

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: value
    };
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    setSelectedFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className="search-filters">
          <button 
            className="filter-toggle"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <i className="fas fa-filter"></i>
            Filters
          </button>
          
          {showFilterDropdown && (
            <div className="filter-dropdown">
              {filters.map(filter => (
                <div key={filter.key} className="filter-group">
                  <label>{filter.label}</label>
                  {filter.type === 'select' ? (
                    <select
                      value={selectedFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    >
                      <option value="">All</option>
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === 'checkbox' ? (
                    <div className="checkbox-group">
                      {filter.options.map(option => (
                        <label key={option.value} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedFilters[filter.key]?.includes(option.value) || false}
                            onChange={(e) => {
                              const currentValues = selectedFilters[filter.key] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter(v => v !== option.value);
                              handleFilterChange(filter.key, newValues);
                            }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              
              <button className="clear-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;