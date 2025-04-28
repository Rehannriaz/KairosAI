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
import { useState } from 'react';

interface CreateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    application: Omit<
      Application,
      'id' | 'userId' | 'updatedDate' | 'appliedDate'
    >
  ) => void;
}

export function CreateApplicationModal({
  isOpen,
  onClose,
  onSave,
}: CreateApplicationModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    location: '',
    url: '',
    logo: '',
    salary: '',
    notes: '',
    nextStep: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Form validation
    if (!formData.company.trim() || !formData.position.trim()) {
      alert('Company and Position are required fields');
      return;
    }

    onSave({
      company: formData.company,
      position: formData.position,
      status: formData.status,
      location: formData.location,
      url: formData.url,
      logo: formData.logo,
      salary: formData.salary,
      application_tracker_notes: formData.notes
        ? [
            {
              id: '', // Provide a default or generated ID
              application_id: '', // Provide a default or generated application ID
              note: formData.notes,
            },
          ]
        : [],
      next_step: formData.nextStep,
      user_id: '',
      applied_date: '',
      updated_date: '',
    });

    // Reset form
    setFormData({
      company: '',
      position: '',
      status: 'applied',
      location: '',
      url: '',
      logo: '',
      salary: '',
      notes: '',
      nextStep: '',
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Job URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nextStep">Next Steps</Label>
            <Textarea
              id="nextStep"
              value={formData.nextStep}
              onChange={(e) => handleChange('nextStep', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
