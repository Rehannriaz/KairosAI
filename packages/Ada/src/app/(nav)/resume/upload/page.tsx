'use client';

import { useState } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import resumeServiceInstance from '@/api/resumeService';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (isValidFileType(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFileType(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return validTypes.includes(file.type);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    // Simulate file upload and parsing
    try {
      const response = await resumeServiceInstance.uploadResume(file);

      console.log('result', response);
    router.push(`/resume/review/${response.resume_id}`);

    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    } finally {
      setIsUploading(false);
      
    }
  };

  const handleCancel = () => {
    router.push('/resume');
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Your Resume</h1>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-10 text-center
            transition-colors duration-200
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'}
            ${file ? 'bg-green-50 border-green-500' : ''}
          `}
        >
          {!file ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg">Drag and drop your resume here</p>
                <p className="text-sm mb-3 text-muted-foreground">or</p>
                <label className="mt-2 cursor-pointer text-primary hover:text-primary/80">
                  <span className="bg-black hover:bg-slate-800 px-8 py-2 rounded-md text-white">
                    Browse files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, DOCX
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <File className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Resume'
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
