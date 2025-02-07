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
    professionalSummary: string
    skills: string[]
    employmentHistory: Array<{
      company: string
      position: string
      duration: string
      responsibilities: string[]
    }>
    education: Array<{
      degree: string
      institution: string
      year: string
    }>
  }
}

export function ResumeDetailsModal({ isOpen, onClose, resume }: ResumeDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Resume Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
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
                  <p>{resume.location}</p>
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

            <section>
              <h3 className="text-lg font-semibold">Professional Summary</h3>
              <p className="mt-2">{resume.professionalSummary}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Employment History</h3>
              <div className="space-y-4 mt-2">
                {resume.employmentHistory.map((job, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium">
                      {job.position} at {job.company}
                    </h4>
                    <p className="text-sm text-muted-foreground">{job.duration}</p>
                    <ul className="list-disc list-inside mt-2">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Education</h3>
              <div className="space-y-2 mt-2">
                {resume.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm">
                      {edu.institution}, {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

