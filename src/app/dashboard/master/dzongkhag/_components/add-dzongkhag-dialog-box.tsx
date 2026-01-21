'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { createDzongkhags } from '@/actions/common/dzongkhag-actions';

const formSchema = z.object({
  name: z.string().min(2, 'Dzongkhag name is required'),
  nameDzo: z.string().min(2, 'Dzongkhag name is required')
});

export function CreateDzongkhagDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      nameDzo: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await createDzongkhags(values);
      if (result?.error) {
        toast.error(result.message || 'Failed to add dzongkhag');
        return;
      }
      toast.success('Dzongkhag added successfully');
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error('Failed to add dzongkhag');
      console.error('Failed to create dzongkhag:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Add Dzongkhag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Dzongkhag</DialogTitle>
        </DialogHeader>
        <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-2 space-y-6">
            <FormInput
              control={form.control}
              name="name"
              label="Dzongkhag Name"
              placeholder="e.g., Thimphu, Paro, Punakha"
              required
            />

            <FormInput
              control={form.control}
              name="nameDzo"
              label="Dzongkhag Name In Dzongkha"
              placeholder="e.g., སྤ་རོ, སྤུ་ན་ཁ།"
              required
            />

            <div className="pt-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Dzongkhag'}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
