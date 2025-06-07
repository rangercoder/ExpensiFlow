'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useExpenseStore, EXPENSE_CATEGORIES, PAYMENT_MODES } from '@/store/expense-store';
import { CalendarIcon, Search, X, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function ExpenseFilters() {
  const { filters, setFilters, clearFilters } = useExpenseStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    
    setFilters({ categories: newCategories });
  };

  const handlePaymentModeChange = (mode: string, checked: boolean) => {
    const newModes = checked
      ? [...filters.paymentModes, mode]
      : filters.paymentModes.filter((m) => m !== mode);
    
    setFilters({ paymentModes: newModes });
  };

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    setFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: date || null,
      },
    });
  };

  const handleSearchSubmit = () => {
    setFilters({ searchQuery: localSearchQuery });
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalSearchQuery('');
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.paymentModes.length + 
    (filters.dateRange.from ? 1 : 0) + 
    (filters.dateRange.to ? 1 : 0) + 
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-[#30437A]">Search Expenses</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#30437A]/60" />
            <Input
              id="search"
              placeholder="Search by notes, category, or payment mode..."
              className="pl-10 border-[#4DC9A9]/30 focus:border-[#4DC9A9] focus:ring-[#4DC9A9]"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          </div>
          <Button onClick={handleSearchSubmit} className="bg-[#4DC9A9] hover:bg-[#4DC9A9]/90 text-white">Search</Button>
        </div>
      </div>

      <Separator className="bg-[#4DC9A9]/20" />

      {/* Date Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[#30437A]">Date Range</Label>
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#30437A] hover:bg-[#4DC9A9]/10"
              onClick={() => setFilters({ dateRange: { from: null, to: null } })}
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-[#30437A]/60">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal border-[#4DC9A9]/30',
                    !filters.dateRange.from && 'text-[#30437A]/60'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    format(filters.dateRange.from, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from || undefined}
                  onSelect={(date) => handleDateRangeChange('from', date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-[#30437A]/60">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal border-[#4DC9A9]/30',
                    !filters.dateRange.to && 'text-[#30437A]/60'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? (
                    format(filters.dateRange.to, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to || undefined}
                  onSelect={(date) => handleDateRangeChange('to', date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Separator className="bg-[#4DC9A9]/20" />

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[#30437A]">Categories</Label>
          {filters.categories.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#30437A] hover:bg-[#4DC9A9]/10"
              onClick={() => setFilters({ categories: [] })}
            >
              <X className="h-3 w-3 mr-1" />
              Clear ({filters.categories.length})
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPENSE_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
                className="border-[#4DC9A9] data-[state=checked]:bg-[#4DC9A9] data-[state=checked]:border-[#4DC9A9]"
              />
              <Label 
                htmlFor={`category-${category}`} 
                className="text-sm font-normal cursor-pointer text-[#30437A]"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#4DC9A9]/20" />

      {/* Payment Modes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[#30437A]">Payment Modes</Label>
          {filters.paymentModes.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#30437A] hover:bg-[#4DC9A9]/10"
              onClick={() => setFilters({ paymentModes: [] })}
            >
              <X className="h-3 w-3 mr-1" />
              Clear ({filters.paymentModes.length})
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PAYMENT_MODES.map((mode) => (
            <div key={mode} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${mode}`}
                checked={filters.paymentModes.includes(mode)}
                onCheckedChange={(checked) => 
                  handlePaymentModeChange(mode, checked as boolean)
                }
                className="border-[#4DC9A9] data-[state=checked]:bg-[#4DC9A9] data-[state=checked]:border-[#4DC9A9]"
              />
              <Label 
                htmlFor={`payment-${mode}`} 
                className="text-sm font-normal cursor-pointer text-[#30437A]"
              >
                {mode}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#4DC9A9]/20">
        <div className="text-sm text-[#30437A]/60">
          {activeFiltersCount > 0 ? (
            `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`
          ) : (
            'No filters applied'
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          disabled={activeFiltersCount === 0}
          className="border-[#30437A]/30 text-[#30437A] hover:bg-[#30437A]/10"
        >
          <Filter className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}