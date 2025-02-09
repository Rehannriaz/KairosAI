import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResumeDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  resume: {
    name: string
    location: string
    email: string
    phone: string
    professional_summary: string
    skills: string[]
    employment_history: Array<{
      company: string
      end_date: string
      start_date: string
      job_title: string
      description: string
      achievements: string[]
    }>
    education: Array<{
      degree: string
      institution: string
      start_date: string
      end_date: string
      gpa?: string | null
      honors: string[]
    }>
  }
}

export function ResumeDetailsModal({ isOpen, onClose, resume }: ResumeDetailsModalProps) {
  // Helper function to format text by adding spaces between words
  const formatText = (text: string) => {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
              .replace(/([a-z])([0-9])/g, '$1 $2')
              .split(/(?=[A-Z])/).join(' ')
              .trim();
  }

  const formatDate = (date: string) => {
    if (date === 'present') return 'Present';
    try {
      const [year, month] = date.split('-');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1);
      return dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return date;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
    <DialogHeader>
      <DialogTitle>Resume Details</DialogTitle>
    </DialogHeader>
    <ScrollArea className="h-full flex-grow overflow-y-auto">
      <div className="space-y-6 p-6">
            <section>
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{resume.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{resume.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{resume.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{resume.phone}</p>
                </div>
              </div>
            </section>

            {resume.professional_summary && (
              <section>
                <h3 className="text-lg font-semibold">Professional Summary</h3>
                <p className="mt-2">{formatText(resume.professional_summary)}</p>
              </section>
            )}

            <section>
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Employment History</h3>
              <div className="space-y-4 mt-2">
                {resume.employment_history.map((job, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium">
                      {formatText(job.job_title)} at {job.company}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(job.start_date)} - {formatDate(job.end_date)}
                    </p>
                    {job.description && (
                      <p className="mt-2 text-sm">{formatText(job.description)}</p>
                    )}
                    {job.achievements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Key Achievements:</p>
                        <ul className="list-disc list-inside mt-1">
                          {job.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-sm">
                              {formatText(achievement)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Education</h3>
              <div className="space-y-4 mt-2">
                {resume.education.map((edu, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium">{formatText(edu.degree)}</h4>
                    <p className="text-sm">
                      {edu.institution}, {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-muted-foreground mt-1">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.honors.length > 0 && (
                      <ul className="list-disc list-inside mt-2">
                        {edu.honors.map((honor, idx) => (
                          <li key={idx} className="text-sm">
                            {formatText(honor)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeDetailsModal;