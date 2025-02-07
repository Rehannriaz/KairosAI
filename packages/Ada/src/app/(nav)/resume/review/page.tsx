"use client"

import { useState } from "react"
import { Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Section {
  id: string
  title: string
  content: string
  type: "input" | "textarea"
}

export default function ResumeReview() {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([
    { id: "name", title: "Name", content: "John Doe", type: "input" },
    { id: "location", title: "Location", content: "New York, NY", type: "input" },
    { id: "email", title: "Email", content: "john@example.com", type: "input" },
    { id: "phone", title: "Phone", content: "(123) 456-7890", type: "input" },
    {
      id: "summary",
      title: "Professional Summary",
      content: "Experienced software engineer with expertise in web development...",
      type: "textarea",
    },
    {
      id: "skills",
      title: "Skills",
      content: "JavaScript, React, Node.js, TypeScript, Next.js",
      type: "textarea",
    },
    {
      id: "employment",
      title: "Employment History",
      content: "Senior Software Engineer at Tech Corp\n2020-Present\n- Led development of...",
      type: "textarea",
    },
    {
      id: "education",
      title: "Education",
      content: "BS in Computer Science\nUniversity of Technology\n2016-2020",
      type: "textarea",
    },
  ])

  const handleOptimize = async (sectionId: string) => {
    // Simulate optimization API call
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    const optimizedContent = `Optimized ${section.content}`
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, content: optimizedContent } : s)))
  }

  const handleContentChange = (sectionId: string, newContent: string) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, content: newContent } : s)))
  }

  const handleSubmit = async () => {
    // Handle final submission
    console.log("Submitting resume data:", sections)
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Review Your Resume</h1>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{section.title}</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOptimize(section.id)}
                  className="h-8 px-2 text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Optimize
                </Button>
              </div>

              {section.type === "input" ? (
                <Input
                  value={section.content}
                  onChange={(e) => handleContentChange(section.id, e.target.value)}
                  className="w-full"
                />
              ) : (
                <Textarea
                  value={section.content}
                  onChange={(e) => handleContentChange(section.id, e.target.value)}
                  className="w-full min-h-[100px]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit}>Submit Resume</Button>
        </div>
      </Card>
    </div>
  )
}

