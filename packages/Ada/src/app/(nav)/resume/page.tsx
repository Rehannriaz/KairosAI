"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Eye, FileText, Plus, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResumeDetailsModal } from "@/components/resume/ResumeDetailsModal"

interface Resume {
  id: string
  name: string
  uploadDate: string
  isPrimary: boolean
  fileName: string
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

export default function ResumeDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  // Sample resume data
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      name: "John Doe",
      uploadDate: "2024-02-07",
      isPrimary: true,
      fileName: "software_engineer_resume.pdf",
      location: "New York, NY",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      professionalSummary: "Experienced software engineer with a focus on web technologies and distributed systems.",
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      employmentHistory: [
        {
          company: "Tech Corp",
          position: "Senior Software Engineer",
          duration: "Jan 2020 - Present",
          responsibilities: [
            "Lead development of microservices architecture",
            "Mentor junior developers",
            "Implement CI/CD pipelines",
          ],
        },
        {
          company: "StartUp Inc",
          position: "Software Engineer",
          duration: "Jun 2017 - Dec 2019",
          responsibilities: [
            "Developed and maintained web applications",
            "Collaborated with UX team to improve user experience",
            "Optimized database queries for better performance",
          ],
        },
      ],
      education: [
        {
          degree: "BS in Computer Science",
          institution: "University of Technology",
          year: "2017",
        },
      ],
    },
    // ... (add more sample resumes with similar structure)
  ])

  const handleUploadClick = () => {
    router.push("/resume/upload")
  }

  const handleReviewClick = (resume: Resume) => {
    setSelectedResume(resume)
  }

  const handleDownload = (fileName: string) => {
    // Implement actual download logic here
    console.log(`Downloading ${fileName}`)
  }

  const handlePrimaryChange = (id: string, checked: boolean) => {
    setResumes(
      resumes.map((resume) => ({
        ...resume,
        isPrimary: resume.id === id ? checked : false,
      })),
    )
  }

  const filteredResumes = resumes.filter((resume) => resume.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const hasPrimaryResume = resumes.some((resume) => resume.isPrimary)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resume Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track your resumes</p>
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
                    {new Date(resume.uploadDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={hasPrimaryResume && !resume.isPrimary ? "opacity-50" : ""}>
                    <Checkbox
                      checked={resume.isPrimary}
                      onCheckedChange={(checked) => handlePrimaryChange(resume.id, checked as boolean)}
                      disabled={!resume.isPrimary && hasPrimaryResume}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(resume.fileName)}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReviewClick(resume)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
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
                    {searchQuery && <p className="text-sm">Try adjusting your search criteria</p>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {selectedResume && (
        <ResumeDetailsModal isOpen={!!selectedResume} onClose={() => setSelectedResume(null)} resume={selectedResume} />
      )}
    </div>
  )
}

