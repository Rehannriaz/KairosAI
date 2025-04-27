import { OPENAI_API_KEY } from '../config';
import { IResume } from '../models/resume.model';
import ResumeRepository from '../repositories/resume.repository';
import resumeRepository from '../repositories/resume.repository';
import fileParser from '../utils/fileParser';
import { OpenAIEmbeddings } from '@langchain/openai';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

const extractResumeData = async (
  userId: string,
  file: Express.Multer.File,
  file_url: string
) => {
  try {
    const text = await fileParser.extractText(file);
    if (!text) {
      throw new Error('Failed to extract text from the resume');
    }
    const embeddingsModel = new OpenAIEmbeddings({ apiKey: OPENAI_API_KEY });
    const embeddings = await embeddingsModel.embedQuery(text);

    // const prompt = `
    // You are a resume parser that extracts structured information from resume text. Analyze the following resume and extract all relevant information into a JSON object.

    // Requirements:
    // 1. All fields must be present in the response, even if empty
    // 2. Follow the exact JSON structure provided
    // 3. Skill level must be one of: "beginner", "intermediate", or "advanced"
    // 4. Infer skill level based on years of experience and complexity of roles
    // 5. Format all dates as "YYYY-MM" or "YYYY" if month is not available
    // 6. Convert all text to proper case (capitalize first letter of names, companies, etc.)
    // 7. Ensure phone numbers are in E.164 format when possible
    // 8. Remove any special characters or formatting from text fields

    // Return the data in this exact structure:
    // {
    //   "name": "string",
    //   "location": "string",
    //   "email": "string",
    //   "phone": "string",
    //   "professional_summary": "string",
    //   "skill_level": "beginner" | "intermediate" | "advanced",
    //   "skills": ["string"],
    //   "employment_history": [
    //     {
    //       "job_title": "string",
    //       "company": "string",
    //       "start_date": "YYYY-MM",
    //       "end_date": "YYYY-MM" | "present",
    //       "description": "string",
    //       "achievements": ["string"]
    //     }
    //   ],
    //   "education": [
    //     {
    //       "degree": "string",
    //       "institution": "string",
    //       "start_date": "YYYY-MM",
    //       "end_date": "YYYY-MM" | "present",
    //       "gpa": "string | null",
    //       "honors": ["string"]
    //     }
    //   ],
    //   "preferences": {
    //     "desired_role": "string | null",
    //     "desired_location": "string | null",
    //     "desired_salary": "string | null",
    //     "work_type": "remote" | "hybrid" | "onsite" | null,
    //     "available_from": "YYYY-MM | null"
    //   }
    // }

    // Resume Text:
    // ${text}

    // Provide the output as a valid JSON object only, with no additional text or formatting.
    // `;

    const prompt = `
    You are a resume parser that extracts structured information from resume text. Analyze the following text and determine if it's a resume. If it is, extract all relevant information into a JSON object.

    First, determine if the provided text appears to be a resume by checking for these characteristics:
    - Contains sections like experience, education, skills, or similar resume components
    - Has personal contact information (name, email, phone)
    - Lists professional experience or job history
    
    If the text does NOT appear to be a resume, return only this JSON:
    {
      "is_resume": false,
      "message": "The uploaded file does not appear to be a resume. Please upload a resume document for parsing."
    }

    If the text IS a resume, return the full JSON with "is_resume": true and all the extracted information:
    {
      "is_resume": true,
      "name": "string",
      "location": "string",
      "email": "string",
      "phone": "string",
      "professional_summary": "string",
      "skill_level": "beginner" | "intermediate" | "advanced",
      "skills": ["string"],
      "employment_history": [
        {
          "job_title": "string",
          "company": "string",
          "start_date": "YYYY-MM",
          "end_date": "YYYY-MM" | "present",
          "description": "string",
          "achievements": ["string"]
        }
      ],
      "education": [
        {
          "degree": "string",
          "institution": "string",
          "start_date": "YYYY-MM",
          "end_date": "YYYY-MM" | "present",
          "gpa": "string | null",
          "honors": ["string"]
        }
      ],
      "preferences": {
        "desired_role": "string | null",
        "desired_location": "string | null",
        "desired_salary": "string | null",
        "work_type": "remote" | "hybrid" | "onsite" | null,
        "available_from": "YYYY-MM | null"
      }
    }

    Requirements for valid resume parsing:
    1. All fields must be present in the response, even if empty
    2. Follow the exact JSON structure provided
    3. Skill level must be one of: "beginner", "intermediate", or "advanced"
    4. Infer skill level based on years of experience and complexity of roles
    5. Format all dates as "YYYY-MM" or "YYYY" if month is not available
    6. Convert all text to proper case (capitalize first letter of names, companies, etc.)
    7. Ensure phone numbers are in E.164 format when possible
    8. Remove any special characters or formatting from text fields

    Resume Text:
    ${text}

    Provide the output as a valid JSON object only, with no additional text or formatting.
    `;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a precise resume parser that outputs only valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      response_format: { type: 'json_object' }, // Ensures JSON response
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsedJson = JSON.parse(content);

    // Check if the uploaded file is a resume
    if (!parsedJson.is_resume) {
      // Return the error message without saving to database
      return parsedJson;
    }

    // Validate skill_level
    if (
      !['beginner', 'intermediate', 'advanced'].includes(parsedJson.skill_level)
    ) {
      parsedJson.skill_level = 'beginner'; // Default to beginner if invalid
    }

    const dbResult = await resumeRepository.uploadUserResume(
      userId,
      parsedJson,
      embeddings,
      file_url
    );
    console.log('dbResult', dbResult);
    const finalResult = { ...parsedJson, resume_id: dbResult };
    return finalResult;
  } catch (error) {
    console.error('Error extracting resume data:', error);
    throw new Error('Failed to process resume'); // Better error handling
  }
};

const getUserResumes = async (userId: string) => {
  return await ResumeRepository.getUserResumes(userId);
};
const getResumeById = async (id: string): Promise<IResume | null> => {
  return await resumeRepository.findResumeById(id); // Fetch a specific resume by ID
};

// Update an existing resume
const updateResume = async (
  id: string,
  resumeData: Partial<IResume>
): Promise<IResume | null> => {
  return await resumeRepository.updateResume(id, resumeData); // Update the resume
};
const setPrimary = async (
  id: string,
  userId: string
): Promise<IResume | null> => {
  return await resumeRepository.setPrimary(id, userId); // Update the resume
};

// Delete a resume by ID
const deleteResume = async (id: string): Promise<IResume | null> => {
  return await resumeRepository.deleteResume(id); // Delete a resume
};

const optimizeResumeText = async (text: string, section: string) => {
  try {
    let prompt = '';

    switch (section) {
      case 'professional_summary':
        prompt = `
        Optimize the following professional summary by:
        1. Adding relevant industry keywords
        2. Making it more impactful and concise
        3. Highlighting core competencies
        4. Using powerful action verbs
        
        Original Summary:
        ${text}
        
        Return in this JSON format:
        {
          "original": "original text",
          "optimized": "enhanced text",
          "added_keywords": ["list", "of", "industry", "specific", "keywords", "added"],
          "improvements": ["list of specific improvements made"]
        }`;
        break;

      case 'experience':
        prompt = `
        Optimize the following work experience entry by:
        1. Quantifying achievements (adding numbers, percentages, scales)
        2. Using strong action verbs
        3. Adding relevant technical and industry keywords
        4. Highlighting measurable impacts
        
        Original Experience:
        ${text}
        
        Return in this JSON format:
        {
          "original": "original text",
          "optimized": "enhanced text",
          "added_keywords": ["list", "of", "industry", "specific", "keywords", "added"],
          "metrics_added": ["list of quantified metrics added"],
          "improvements": ["list of specific improvements made"]
        }`;
        break;

      default:
        throw new Error('Invalid section specified');
    }

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume optimizer specializing in ${section} optimization. Focus on making the content more impactful while maintaining authenticity.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });

    const optimizedContent = response.choices[0].message.content || '{}';
    const jsonMatch = optimizedContent.match(/```json([\s\S]*?)```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : optimizedContent;

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error(`Error optimizing ${section}:`, error);
    throw new Error(`Failed to optimize ${section}`);
  }
};

export default {
  extractResumeData,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  setPrimary,
  optimizeResumeText,
};
