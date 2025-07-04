'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useExpenseStore, EXPENSE_CATEGORIES, PAYMENT_MODES } from '@/store/expense-store';
import { Search, Filter, CalendarIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ExpenseList } from './expense-list';
import { addDays, subDays, startOfMonth, endOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const TIMELINE_OPTIONS = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last 30 Days', value: 'last_30' },
  { label: 'Last 90 Days', value: 'last_90' },
  { label: 'All Time', value: 'all' },
  { label: 'Custom Range', value: 'custom' },
];

export function ExpenseFilters() {
  const { filters, setFilters, clearFilters, getFilteredExpenses } = useExpenseStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery);
  const [timeline, setTimeline] = useState('all');
  const [open, setOpen] = useState(false);

  // Handle timeline change
  const handleTimelineChange = (value: string) => {
    setTimeline(value);
    const now = new Date();
    let from: Date | null = null;
    let to: Date | null = null;
    if (value === 'this_month') {
      from = startOfMonth(now);
      to = endOfDay(now);
    } else if (value === 'last_30') {
      from = subDays(now, 30);
      to = endOfDay(now);
    } else if (value === 'last_90') {
      from = subDays(now, 90);
      to = endOfDay(now);
    } else if (value === 'all') {
      from = null;
      to = null;
    }
    if (value !== 'custom') {
      setFilters({ dateRange: { from, to } });
    }
  };

  const handleCustomRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    if (date) {
      // Set the time to end of day for the selected date
      const selectedDate = endOfDay(date);
      // If it's the current date, ensure it's included
      const now = new Date();
      const isCurrentDate = date.getDate() === now.getDate() && 
                           date.getMonth() === now.getMonth() && 
                           date.getFullYear() === now.getFullYear();
      
      setFilters({
        dateRange: {
          ...filters.dateRange,
          [field]: isCurrentDate ? endOfDay(now) : selectedDate,
        },
      });
    } else {
      setFilters({
        dateRange: {
          ...filters.dateRange,
          [field]: null,
        },
      });
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    setFilters({ categories: newCategories });
  };

  const handleSearchSubmit = () => {
    setFilters({ searchQuery: localSearchQuery });
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalSearchQuery('');
    setTimeline('all');
  };

  // Get filtered expenses for display
  const filteredExpenses = getFilteredExpenses();

  return (
    <div className="space-y-8">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="icon" className="border-[#4DC9A9]/30 text-[#30437A]">
              <Filter className="h-5 w-5" />
            </Button>
          </CollapsibleTrigger>
          <span className="text-[#30437A] font-medium">Filters</span>
        </div>
        <CollapsibleContent>
          <div className="space-y-6">
            {/* Timeline Filter */}
            <div className="space-y-2">
              <Label className="text-[#30437A]">Timeline</Label>
              <div className="flex gap-4 flex-wrap">
                {TIMELINE_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={timeline === option.value ? 'default' : 'outline'}
                    className={timeline === option.value ? 'bg-[#4DC9A9] text-white' : 'border-[#4DC9A9]/30 text-[#30437A]'}
                    onClick={() => handleTimelineChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {timeline === 'custom' && (
                <div className="flex gap-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-[#30437A]/60">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={
                            'w-full justify-start text-left font-normal border-[#4DC9A9]/30' +
                            (!filters.dateRange.from ? ' text-[#30437A]/60' : '')
                          }
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? (
                            filters.dateRange.from.toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.from || undefined}
                          onSelect={(date) => handleCustomRangeChange('from', date)}
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
                          className={
                            'w-full justify-start text-left font-normal border-[#4DC9A9]/30' +
                            (!filters.dateRange.to ? ' text-[#30437A]/60' : '')
                          }
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.to ? (
                            filters.dateRange.to.toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.to || undefined}
                          onSelect={(date) => handleCustomRangeChange('to', date)}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-[#4DC9A9]/20" />

            {/* Category Multi-Select */}
            <div className="space-y-2">
              <Label className="text-[#30437A]">Categories</Label>
              <div className="flex flex-wrap gap-3">
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

            {/* Payment Method Multi-Select */}
            <div className="space-y-2">
              <Label className="text-[#30437A]">Payment Methods</Label>
              <div className="flex flex-wrap gap-3">
                {PAYMENT_MODES.map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox
                      id={`payment-${mode}`}
                      checked={filters.paymentModes.includes(mode)}
                      onCheckedChange={(checked) => {
                        const newModes = checked
                          ? [...filters.paymentModes, mode]
                          : filters.paymentModes.filter((m) => m !== mode);
                        setFilters({ paymentModes: newModes });
                      }}
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
                {filters.categories.length > 0 || filters.searchQuery || timeline !== 'all' ? (
                  'Filters applied'
                ) : (
                  'No filters applied'
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="border-[#30437A]/30 text-[#30437A] hover:bg-[#30437A]/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Filtered Expense History */}
      <div>
        <ExpenseList expenses={filteredExpenses} />
      </div>
    </div>
  );
}