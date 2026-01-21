'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateDzongkhag } from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Dzongkhag name is required'),
  nameDzo: z.string().min(2, 'Dzongkhag name is required')
});

interface UpdateDzongkhagDialogProps {
  dzongkhagId: string;
  dzongkhagName: string;
  dzongkhagNameDzo: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UpdateDzongkhagDialog({
  dzongkhagId,
  dzongkhagName,
  dzongkhagNameDzo,
  open,
  setOpen
}: UpdateDzongkhagDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dzongkhagName,
      nameDzo: dzongkhagNameDzo
    }
  });

  // Update form values when props change
  useEffect(() => {
    form.reset({
      name: dzongkhagName,
      nameDzo: dzongkhagNameDzo
    });
  }, [dzongkhagName, dzongkhagNameDzo, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await updateDzongkhag(dzongkhagId, values);
      if (result?.error) {
        toast.error(result.message || 'Failed to update dzongkhag');
        return;
      }
      toast.success('Dzongkhag updated successfully');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update dzongkhag');
      console.error('Failed to update dzongkhag:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dzongkhag</DialogTitle>
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
                {loading ? 'Updating...' : 'Update Dzongkhag'}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
