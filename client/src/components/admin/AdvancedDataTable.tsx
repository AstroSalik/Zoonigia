import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Download,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdvancedDataTableProps {
  data: any[];
  columns: Column[];
  searchKeys?: string[];
  itemsPerPage?: number;
  onRowClick?: (row: any) => void;
  rowActions?: (row: any) => React.ReactNode;
  bulkActions?: React.ReactNode;
  emptyMessage?: string;
}

export function AdvancedDataTable({
  data,
  columns,
  searchKeys = [],
  itemsPerPage = 10,
  onRowClick,
  rowActions,
  bulkActions,
  emptyMessage = "No data available"
}: AdvancedDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null
  });
  const [filterConfig, setFilterConfig] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Search functionality
  const searchedData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => {
      const searchableFields = searchKeys.length > 0 ? searchKeys : Object.keys(row);
      return searchableFields.some(key => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Filter functionality
  const filteredData = useMemo(() => {
    let result = searchedData;
    
    Object.entries(filterConfig).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const rowValue = row[key];
          if (rowValue === null || rowValue === undefined) return false;
          return rowValue.toString().toLowerCase() === value.toLowerCase();
        });
      }
    });
    
    return result;
  }, [searchedData, filterConfig]);

  // Sort functionality
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = aValue.toString().toLowerCase();
      const bString = bValue.toString().toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: '', direction: null };
    });
  };

  const handleRowSelection = (index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 ml-2 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-2 text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-2 text-blue-400" />
    );
  };

  const getUniqueFilterValues = (key: string) => {
    const values = new Set(data.map(row => row[key]).filter(v => v !== null && v !== undefined));
    return Array.from(values).map(v => v.toString());
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-space-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-space-800/50 border-space-700 text-white placeholder:text-space-400"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Filter dropdowns */}
        {columns.filter(col => col.filterable).map(col => (
          <Select
            key={col.key}
            value={filterConfig[col.key] || ''}
            onValueChange={(value) => {
              setFilterConfig(prev => ({ ...prev, [col.key]: value }));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] bg-space-800/50 border-space-700">
              <SelectValue placeholder={`Filter ${col.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All {col.label}s</SelectItem>
              {getUniqueFilterValues(col.key).map(value => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {Object.keys(filterConfig).some(key => filterConfig[key]) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterConfig({})}
            className="border-space-700 text-space-300"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedRows.size > 0 && bulkActions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
        >
          <span className="text-blue-400 font-medium">
            {selectedRows.size} selected
          </span>
          {bulkActions}
        </motion.div>
      )}

      {/* Results count */}
      <div className="text-sm text-space-400">
        Showing {paginatedData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to{' '}
        {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
      </div>

      {/* Table */}
      <div className="rounded-lg border border-space-700 bg-space-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-space-700 hover:bg-space-800/70">
                {bulkActions && (
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-space-600 text-blue-500 focus:ring-blue-500"
                    />
                  </TableHead>
                )}
                {columns.map(col => (
                  <TableHead key={col.key} className="text-space-300">
                    {col.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(col.key)}
                        className="hover:bg-space-700 hover:text-white"
                      >
                        {col.label}
                        {getSortIcon(col.key)}
                      </Button>
                    ) : (
                      col.label
                    )}
                  </TableHead>
                ))}
                {rowActions && <TableHead className="text-space-300">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (bulkActions ? 1 : 0) + (rowActions ? 1 : 0)}
                      className="text-center py-12 text-space-400"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => onRowClick?.(row)}
                      className={`
                        border-space-700 
                        ${onRowClick ? 'cursor-pointer hover:bg-space-700/50' : ''} 
                        ${selectedRows.has(index) ? 'bg-blue-500/10' : ''}
                        transition-colors
                      `}
                    >
                      {bulkActions && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedRows.has(index)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleRowSelection(index);
                            }}
                            className="rounded border-space-600 text-blue-500 focus:ring-blue-500"
                          />
                        </TableCell>
                      )}
                      {columns.map(col => (
                        <TableCell key={col.key} className="text-space-200">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </TableCell>
                      ))}
                      {rowActions && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {rowActions(row)}
                        </TableCell>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-space-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="border-space-700"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-space-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-blue-600" : "border-space-700"}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-space-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="border-space-700"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

