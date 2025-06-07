'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useExpenseStore, EXPENSE_CATEGORIES, PAYMENT_MODES } from '@/store/expense-store';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Amount must be a positive number'
  ),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional().default(''),
  date: z.date({
    required_error: 'Date is required',
  }),
  paymentMode: z.string().min(1, 'Payment mode is required'),
});

type FormData = z.infer<typeof formSchema>;

export function ExpenseForm() {
  const { addExpense } = useExpenseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      category: '',
      notes: '',
      date: new Date(),
      paymentMode: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await addExpense({
        amount: Number(data.amount),
        category: data.category,
        notes: data.notes || '',
        date: data.date.toISOString().split('T')[0],
        paymentMode: data.paymentMode,
      });

      form.reset({
        amount: '',
        category: '',
        notes: '',
        date: new Date(),
        paymentMode: '',
      });

      toast.success('Expense added successfully!');
    } catch (error) {
      toast.error('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30437A]">Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#30437A]/60">
                     ₹ 
                    </span>
                    <Input
                      placeholder="0.00"
                      className="pl-8 border-[#4DC9A9]/30 focus:border-[#4DC9A9] focus:ring-[#4DC9A9]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30437A]">Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-[#4DC9A9]/30 focus:border-[#4DC9A9] focus:ring-[#4DC9A9]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30437A]">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal border-[#4DC9A9]/30 hover:border-[#4DC9A9]',
                          !field.value && 'text-[#30437A]/60'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30437A]">Payment Mode</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-[#4DC9A9]/30 focus:border-[#4DC9A9] focus:ring-[#4DC9A9]">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#30437A]">Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about this expense..."
                  className="resize-none border-[#4DC9A9]/30 focus:border-[#4DC9A9] focus:ring-[#4DC9A9]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#4DC9A9] hover:bg-[#4DC9A9]/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            'Adding Expense...'
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}