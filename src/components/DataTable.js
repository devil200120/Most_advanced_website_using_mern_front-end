// frontend/src/components/DataTable.js
import React, { useState } from 'react';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import './DataTable.css';

const DataTable = ({ 
  data, 
  columns, 
  title,
  searchable = true,
  sortable = true,
  paginated = true,
  itemsPerPage = 10,
  actions = null,
  onRowClick = null,
  loading = false,
  emptyMessage = "No data available"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = paginated 
    ? sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : sortedData;

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column) => {
    if (!sortable) return;
    
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  };

  if (loading) {
    return (
      <div className="data-table-container">
        <div className="loading">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      {title && <h2 className="table-title">{title}</h2>}
      
      {searchable && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search table data..."
        />
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`${sortable && column.sortable !== false ? 'sortable' : ''} ${
                    sortColumn === column.key ? `sorted-${sortDirection}` : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  {column.title}
                  {sortable && column.sortable !== false && (
                    <span className="sort-indicator">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : '↕'}
                    </span>
                  )}
                </th>
              ))}
              {actions && <th className="actions-column">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-row">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr 
                  key={item.id || index}
                  className={onRowClick ? 'clickable' : ''}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map(column => (
                    <td key={column.key}>
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                  {actions && (
                    <td className="actions-cell">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={sortedData.length}
        />
      )}
    </div>
  );
};

export default DataTable;