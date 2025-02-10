"use client"

import { useState,useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
import { Wand2, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import resumeServiceInstance from "@/api/resumeService"
import ResumeReviewSkeleton from "@/components/resume/ResumeReviewSkeleton"
interface Education {
  degree: string
  institution: string
  start_date: string
  end_date?: string
}

interface Employment {
  job_title: string
  company: string
  start_date: string
  end_date: string
  description: string
}

interface Preferences {
  desired_role: string | null
  desired_location: string | null
  desired_salary: string | null
  work_type: string | null
}

interface Resume {
  name: string
  location: string
  email: string
  phone: string
  professional_summary: string
  skill_level: string
  skills: string[]
  education: Education[]
  employment_history: Employment[]
  preferences: Preferences
}

interface OptimizationResponse {
  original: string | Employment[] | Education[] | string[]
  optimized: string | Employment[] | Education[] | string[]
  added_keywords: string[]
  improvements: string[]
  jobOptimizations?: {
    [key: number]: {
      added_keywords: string[]
      improvements: string[]
    }
  }
}
interface PageProps {
  params: {
    resumeID: string;
  };
}
export default function ResumeReview({ params }: PageProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resume, setResume] = useState<Resume>({
    name: "",
    location: "",
    email: "",
    phone: "",
    professional_summary: "",
    skill_level: "intermediate",
    skills: [],
    education: [],
    employment_history: [],
    preferences: {
      desired_role: null,
      desired_location: null,
      desired_salary: null,
      work_type: null,
    },
  })

  const [optimizationResults, setOptimizationResults] = useState<OptimizationResponse | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
  const fetchResumeData = async () => {
    if (params.resumeID) {
      try {
        setIsLoading(true)
        const resumeData = await resumeServiceInstance.getResumeById(params.resumeID as string)
        setResume(resumeData)
      } catch (error) {
        console.error("Error fetching resume:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  fetchResumeData()
}, [params.resumeID])
  const handleContentChange = (field: keyof Resume, value: string | string[] | any) => {
    setResume((prev) => ({ ...prev, [field]: value }))
  }

  const handleOptimize = async (field: keyof Resume, text?: string, index?: number) => {
    setIsOptimizing(true)
    try {
      let section: string
      let textToOptimize: string

      if (field === "professional_summary") {
        section = "professional_summary"
        textToOptimize = resume.professional_summary
      } else if (field === "employment_history" && typeof index === "number") {
        section = "experience"
        textToOptimize = resume.employment_history[index].description
      } else {
        throw new Error("Invalid optimization request")
      }

      const response = await resumeServiceInstance.optimizeResumeText(textToOptimize, section)

      if (field === "employment_history" && typeof index === "number") {
        // Update specific job description
        const updatedHistory = [...resume.employment_history]
        updatedHistory[index].description = response.optimized
        handleContentChange("employment_history", updatedHistory)

        // Create job-specific optimization results
        setOptimizationResults({
          original: textToOptimize,
          optimized: response.optimized,
          added_keywords: response.added_keywords,
          improvements: response.improvements,
          jobOptimizations: {
            [index]: {
              added_keywords: response.added_keywords,
              improvements: response.improvements,
            },
          },
        })
      } else {
        // Update professional summary
        handleContentChange(field, response.optimized)
        setOptimizationResults(response)
      }
    } catch (error) {
      console.error("Error optimizing content:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

   const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (params.resumeID) {
        await resumeServiceInstance.updateResume(params.resumeID as string, resume)
      }
      router.push("/resume")
    } catch (error) {
      console.error("Error updating resume:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          start_date: "",
          end_date: "",
        },
      ],
    }))
  }

  const addEmployment = () => {
    setResume((prev) => ({
      ...prev,
      employment_history: [
        ...prev.employment_history,
        {
          job_title: "",
          company: "",
          start_date: "",
          end_date: "",
          description: "",
        },
      ],
    }))
  }

  const deleteEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const deleteEmployment = (index: number) => {
    setResume((prev) => ({
      ...prev,
      employment_history: prev.employment_history.filter((_, i) => i !== index),
    }))
  }
  if (isLoading) {
  return <ResumeReviewSkeleton />
}

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Review Your Resume</h1>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={resume.name} onChange={(e) => handleContentChange("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resume.location}
                  onChange={(e) => handleContentChange("location", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={resume.email} onChange={(e) => handleContentChange("email", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={resume.phone} onChange={(e) => handleContentChange("phone", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="professional_summary">Professional Summary</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOptimize("professional_summary")}
                className="h-8 px-2 text-xs"
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-3 w-3" />
                    Optimize
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="professional_summary"
              value={resume.professional_summary}
              onChange={(e) => handleContentChange("professional_summary", e.target.value)}
              className="min-h-[100px]"
            />
            {optimizationResults && (
              <div className="mt-2">
                <p className="text-sm font-medium">Added keywords:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {optimizationResults.added_keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm font-medium mt-2">Improvements:</p>
                <ul className="list-disc list-inside text-sm">
                  {optimizationResults.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              value={resume.skills.join(", ")}
              onChange={(e) =>
                handleContentChange(
                  "skills",
                  e.target.value.split(", ").filter((skill) => skill.trim() !== ""),
                )
              }
              className="min-h-[100px]"
            />
          </div>

          {/* Employment History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Employment History</h2>
              <Button variant="outline" size="sm" onClick={addEmployment} className="h-8 px-2 text-xs">
                <Plus className="mr-2 h-3 w-3" />
                Add Employment
              </Button>
            </div>
            {resume.employment_history.map((job, index) => (
              <div key={index} className="space-y-2 pr-4 pb-4 pl-4 pt-10 border rounded-md relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEmployment(index)}
                  className="absolute top-2 right-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  value={job.job_title}
                  onChange={(e) => {
                    const updatedHistory = [...resume.employment_history]
                    updatedHistory[index].job_title = e.target.value
                    handleContentChange("employment_history", updatedHistory)
                  }}
                  placeholder="Job Title"
                />
                <Input
                  value={job.company}
                  onChange={(e) => {
                    const updatedHistory = [...resume.employment_history]
                    updatedHistory[index].company = e.target.value
                    handleContentChange("employment_history", updatedHistory)
                  }}
                  placeholder="Company"
                />
                <div className="flex gap-2">
                  <Input
                    value={job.start_date}
                    onChange={(e) => {
                      const updatedHistory = [...resume.employment_history]
                      updatedHistory[index].start_date = e.target.value
                      handleContentChange("employment_history", updatedHistory)
                    }}
                    placeholder="Start Date"
                  />
                  <Input
                    value={job.end_date}
                    onChange={(e) => {
                      const updatedHistory = [...resume.employment_history]
                      updatedHistory[index].end_date = e.target.value
                      handleContentChange("employment_history", updatedHistory)
                    }}
                    placeholder="End Date"
                  />
                </div>
                <Textarea
                  value={job.description}
                  onChange={(e) => {
                    const updatedHistory = [...resume.employment_history]
                    updatedHistory[index].description = e.target.value
                    handleContentChange("employment_history", updatedHistory)
                  }}
                  placeholder="Job Description"
                  className="min-h-[100px]"
                />
                <Button
    variant="ghost"
    size="sm"
    onClick={() => handleOptimize("employment_history", job.description, index)}
    className="h-8 px-2 text-xs"
    disabled={isOptimizing}
  >
    {isOptimizing ? (
      <>
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        Optimizing...
      </>
    ) : (
      <>
        <Wand2 className="mr-2 h-3 w-3" />
        Optimize
      </>
    )}
  </Button>
                {optimizationResults?.jobOptimizations && optimizationResults.jobOptimizations[index] && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Added keywords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {optimizationResults.jobOptimizations[index].added_keywords.map((keyword, keywordIndex) => (
                        <Badge key={keywordIndex} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm font-medium mt-2">Improvements:</p>
                    <ul className="list-disc list-inside text-sm">
                      {optimizationResults.jobOptimizations[index].improvements.map((improvement, improvementIndex) => (
                        <li key={improvementIndex}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Education</h2>
              <Button variant="outline" size="sm" onClick={addEducation} className="h-8 px-2 text-xs">
                <Plus className="mr-2 h-3 w-3" />
                Add Education
              </Button>
            </div>
            {resume.education.map((edu, index) => (
              <div key={index} className="space-y-2 pr-4 pb-4 pl-4 pt-10 border rounded-md relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEducation(index)}
                  className="absolute top-2 right-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  value={edu.degree}
                  onChange={(e) => {
                    const updatedEducation = [...resume.education]
                    updatedEducation[index].degree = e.target.value
                    handleContentChange("education", updatedEducation)
                  }}
                  placeholder="Degree"
                />
                <Input
                  value={edu.institution}
                  onChange={(e) => {
                    const updatedEducation = [...resume.education]
                    updatedEducation[index].institution = e.target.value
                    handleContentChange("education", updatedEducation)
                  }}
                  placeholder="Institution"
                />
                <div className="flex gap-2">
                  <Input
                    value={edu.start_date}
                    onChange={(e) => {
                      const updatedEducation = [...resume.education]
                      updatedEducation[index].start_date = e.target.value
                      handleContentChange("education", updatedEducation)
                    }}
                    placeholder="Start Date"
                  />
                  <Input
                    value={edu.end_date}
                    onChange={(e) => {
                      const updatedEducation = [...resume.education]
                      updatedEducation[index].end_date = e.target.value
                      handleContentChange("education", updatedEducation)
                    }}
                    placeholder="End Date"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Resume"
          )}
        </Button>
      </div>
      </Card>
    </div>
  )
}

