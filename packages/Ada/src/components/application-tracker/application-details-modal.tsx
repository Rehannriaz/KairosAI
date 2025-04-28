'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Application } from '@/types/application-tracker';
import { format } from 'date-fns';
import { useState } from 'react';

interface ApplicationDetailsModalProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApplication: Application) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}

export function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isEditing,
}: ApplicationDetailsModalProps) {
  const [formData, setFormData] = useState<Application>({ ...application });

  const handleChange = (field: keyof Application, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Application' : 'Application Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="status" value={formData.status} disabled />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input
                id="appliedDate"
                type="date"
                value={formatDate(formData.applied_date)}
                onChange={(e) =>
                  handleChange('applied_date', `${e.target.value}T00:00:00Z`)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                value={formData.salary || ''}
                onChange={(e) => handleChange('salary', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">Job URL</Label>
            <Input
              id="url"
              value={formData.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo || ''}
              onChange={(e) => handleChange('logo', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.application_tracker_notes?.[0]?.note ?? ''}
              onChange={(e) => {
                const updatedNotes = [
                  ...(formData.application_tracker_notes || []),
                ];
                if (updatedNotes.length > 0) {
                  updatedNotes[0] = {
                    ...updatedNotes[0],
                    note: e.target.value,
                  };
                } else {
                  updatedNotes.push({
                    note: e.target.value,
                    id: '',
                    application_id: '',
                  });
                }
                setFormData((prev) => ({
                  ...prev,
                  application_tracker_notes: updatedNotes,
                }));
              }}
              disabled={!isEditing}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="next_step">Next Steps</Label>
            <Textarea
              id="next_step"
              value={formData.next_step || ''}
              onChange={(e) => handleChange('next_step', e.target.value)}
              disabled={!isEditing}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {isEditing && (
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(formData.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {isEditing && <Button onClick={handleSubmit}>Save Changes</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
