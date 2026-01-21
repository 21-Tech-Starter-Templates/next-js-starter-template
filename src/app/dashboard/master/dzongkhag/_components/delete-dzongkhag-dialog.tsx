'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteDzongkhag } from '@/actions/common/dzongkhag-actions';

interface DeleteDzongkhagDialogProps {
  dzongkhagId: string;
  dzongkhagName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DeleteDzongkhagDialog({
  dzongkhagId,
  dzongkhagName,
  open,
  setOpen
}: DeleteDzongkhagDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const isDeleteEnabled = confirmText === dzongkhagName;

  async function onConfirm() {
    if (!isDeleteEnabled) return;

    try {
      setLoading(true);
      await deleteDzongkhag(dzongkhagId);
      toast.success('Dzongkhag deleted successfully');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete dzongkhag');
      console.error('Failed to delete dzongkhag:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Dzongkhag</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            dzongkhag and all its associated gewogs and villages from the
            database.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              To confirm, type{' '}
              <span className="font-semibold">{dzongkhagName}</span> below:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={dzongkhagName}
            />
          </div>
          <div>
            <Button
              className="w-full"
              variant="destructive"
              onClick={onConfirm}
              disabled={!isDeleteEnabled || loading}
            >
              {loading ? 'Deleting...' : 'Delete Dzongkhag'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
