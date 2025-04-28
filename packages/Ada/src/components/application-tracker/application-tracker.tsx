'use client';

import { ApplicationCard } from './application-card';
import { ApplicationDetailsModal } from './application-details-modal';
import { CreateApplicationModal } from './create-application-modal';
import { ApplicationTrackerService } from '@/api/applicationTrackerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserId } from '@/lib';
import { Application, ApplicationNote } from '@/types/application-tracker';
import { Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewApplication, setViewApplication] = useState<Application | null>(
    null
  );
  const [editApplication, setEditApplication] = useState<Application | null>(
    null
  );

  const userID = getUserId();

  useEffect(() => {
    if (userID) {
      fetchApplications();
    }
  }, [userID]);

  const fetchApplications = async () => {
    if (!userID) return;
    setLoading(true);
    try {
      const fetchedApplications =
        await ApplicationTrackerService.getApplications(userID);
      const formattedApplications: Application[] = fetchedApplications.map(
        (app) => ({
          id: app.id,
          user_id: app.user_id,
          company: app.company,
          position: app.position,
          status: app.status.toLowerCase(),
          applied_date: app.applied_date,
          updated_date: app.updated_date,
          location: app.location || null,
          salary: app.salary || null,
          next_step: app.next_step || null,
          url: app.url || null,
          application_tracker_notes: app.application_tracker_notes || [],
        })
      );
      setApplications(formattedApplications);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (application: Application) => {
    setViewApplication(application);
    setIsViewModalOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setEditApplication(application);
    setIsEditModalOpen(true);
  };
  const handleCreateApplication = async (
    newApplication: Omit<
      Application,
      'id' | 'userId' | 'updatedDate' | 'appliedDate'
    >
  ) => {
    if (!userID) return;

    try {
      // Create the application in the database
      const createdApp = await ApplicationTrackerService.createApplication({
        user_id: userID,
        company: newApplication.company,
        position: newApplication.position,
        status:
          newApplication.status.charAt(0).toUpperCase() +
          newApplication.status.slice(1),
        location: newApplication.location,
        salary: newApplication.salary,
        next_step: newApplication.next_step,
        url: newApplication.url,
        logo: newApplication.logo,
        application_tracker_notes: newApplication.application_tracker_notes,
      });

      // Format the created application to match your Application type
      const formattedApp: Application = {
        id: createdApp.id.toString(),
        company: createdApp.company,
        position: createdApp.position,
        status: createdApp.status.toLowerCase(),
        location: createdApp.location || '',
        applied_date: createdApp.applied_date,
        updated_date: createdApp.updated_date,
        url: createdApp.url || '',
        logo: createdApp.logo || '',
        salary: createdApp.salary || '',
        application_tracker_notes:
          newApplication.application_tracker_notes || [],
        next_step: createdApp.next_step || '',
        user_id: createdApp.user_id,
      };

      // Add to local state
      setApplications([formattedApp, ...applications]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating application:', err);
      alert('Failed to create application. Please try again.');
    }
  };
  const handleUpdateStatus = async (
    id: string,
    status: Application['status']
  ) => {
    if (!userID) return;
    try {
      await ApplicationTrackerService.updateApplication({
        id,
        user_id: userID,
        status: status.charAt(0).toUpperCase() + status.slice(1),
      });
      setApplications(
        applications.map((app) =>
          app.id === id
            ? {
                ...app,
                status,
                updated_date: new Date().toISOString(),
              }
            : app
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleSaveApplication = async (updatedApplication: Application) => {
    if (!userID) return;
    try {
      await ApplicationTrackerService.updateApplication({
        id: updatedApplication.id,
        user_id: userID,
        company: updatedApplication.company,
        position: updatedApplication.position,
        status:
          updatedApplication.status.charAt(0).toUpperCase() +
          updatedApplication.status.slice(1),
        location: updatedApplication.location,
        salary: updatedApplication.salary,
        next_step: updatedApplication.next_step,
        url: updatedApplication.url,
      });

      // Notes: assume single note for now (optional)
      const notes = updatedApplication.application_tracker_notes;
      if (notes && notes.length > 0) {
        const existingNotes = await ApplicationTrackerService.getNotes(
          updatedApplication.id
        );
        if (existingNotes.length > 0) {
          await ApplicationTrackerService.updateNote(
            existingNotes[0].id,
            notes[0].note
          );
        } else {
          await ApplicationTrackerService.addNote(
            updatedApplication.id,
            notes[0].note
          );
        }
      }

      setApplications(
        applications.map((app) =>
          app.id === updatedApplication.id
            ? {
                ...updatedApplication,
                updated_date: new Date().toISOString(),
              }
            : app
        )
      );
    } catch (err) {
      console.error('Error saving application:', err);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (
      !userID ||
      !confirm('Are you sure you want to delete this application?')
    )
      return;
    try {
      await ApplicationTrackerService.deleteApplication(id, userID);
      setApplications(applications.filter((app) => app.id !== id));
      if (selectedApplication?.id === id) {
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white">
            Application Tracker
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search companies or positions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
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

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={handleViewDetails}
                  onEditApplication={handleEditApplication}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteApplication={handleDeleteApplication}
                />
              ))
            ) : (
              <div className="text-center py-12">No applications found.</div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {viewApplication && (
        <ApplicationDetailsModal
          application={viewApplication}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewApplication(null);
          }}
          onSave={handleSaveApplication}
          onDelete={handleDeleteApplication}
          isEditing={false}
        />
      )}

      {editApplication && (
        <ApplicationDetailsModal
          application={editApplication}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditApplication(null);
          }}
          onSave={handleSaveApplication}
          onDelete={handleDeleteApplication}
          isEditing={true}
        />
      )}
      <CreateApplicationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateApplication}
      />
    </div>
  );
}
