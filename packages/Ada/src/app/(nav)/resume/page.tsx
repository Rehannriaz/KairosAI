'use client';

import resumeServiceInstance from '@/api/resumeService';
import ResumeDashboardSkeleton from '@/components/resume/ResumeDashboardSkeleton';
import { ResumeDetailsModal } from '@/components/resume/ResumeDetailsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface Resume {
  file_url?: string;
  id: string;
  name: string;
  uploaddate: string;
  isPrimary: boolean;
  fileName: string;
  location: string;
  email: string;
  phone: string;
  professional_summary: string;
  skills: string[];
  employment_history: Array<{
    company: string;
    end_date: string;
    start_date: string;
    job_title: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    gpa?: string | null;
    honors: string[];
  }>;
  primary_resume_id?: string;
}

export default function ResumeDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [primaryResumeId, setPrimaryResumeId] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await resumeServiceInstance.getUserResumes();

      response[0]
        ? setPrimaryResumeId(response[0].primary_resume_id)
        : setPrimaryResumeId(null);
      setResumes(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resumes. Please try again later.');
      console.error('Error fetching resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    router.push('/resume/upload');
  };

  const handleReviewClick = (resume: Resume) => {
    setSelectedResume(resume);
  };
  const handleDownloadFile = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'resume'; // Set the download attribute with filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up by revoking the blob URL
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const handleDownload = async (file_url: string) => {
    try {
      handleDownloadFile(file_url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      setError('Failed to download resume. Please try again later.');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/resume/review/${id}`);
  };

  const handlePrimaryChange = async (id: string) => {
    try {
      // Update the UI optimistically
      setPrimaryResumeId(id); // Update the globally shared primary resume ID
      await resumeServiceInstance.setResumeAsPrimary(id);
    } catch (err) {
      // Revert the UI change if the API call fails
      await fetchResumes();
      console.error('Error updating primary resume:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // First update the UI optimistically by removing the resume from local state
      setResumes((currentResumes) =>
        currentResumes.filter((resume) => resume.id !== id)
      );

      // Then make the API call
      await resumeServiceInstance.deleteResume(id);
    } catch (err) {
      // If the API call fails, revert the UI by fetching the current state
      console.error('Error deleting resume:', err);
      await fetchResumes();
      // Optionally show an error message to the user
      setError('Failed to delete resume. Please try again.');
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <ResumeDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resume Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your resumes
          </p>
        </div>
        <Button onClick={handleUploadClick}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-[360px] md:w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResumes.map((resume) => (
                <TableRow key={resume.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{resume.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(resume.uploaddate).toLocaleString('en-US', {
                        timeZone: 'Asia/Karachi', // GMT+5
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={
                        resume.id != primaryResumeId ? '' : 'opacity-50'
                      }
                    >
                      <Checkbox
                        checked={resume.id === primaryResumeId}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handlePrimaryChange(resume.id); // Set this resume as primary
                          }
                        }}
                        disabled={resume.id == primaryResumeId}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {resume.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            resume.file_url && handleDownload(resume.file_url)
                          }
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(resume.id)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReviewClick(resume)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredResumes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <p>No resumes found</p>
                      {searchQuery && (
                        <p className="text-sm">
                          Try adjusting your search criteria
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedResume && (
        <ResumeDetailsModal
          isOpen={!!selectedResume}
          onClose={() => setSelectedResume(null)}
          resume={selectedResume}
        />
      )}
    </div>
  );
}
