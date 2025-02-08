import OpenAI from 'openai';
import fileParser from '../utils/fileParser';
import ResumeRepository from '../repositories/resume.repository';
import dotenv from 'dotenv';
import { OPENAI_API_KEY } from '../config';
import resumeRepository from '../repositories/resume.repository';
import { OpenAIEmbeddings } from '@langchain/openai';

dotenv.config();

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

const extractResumeData = async (userId: string, file: Express.Multer.File) => {
  try {
    // Extract text from the uploaded resume file
    const text = await fileParser.extractText(file);
    if (!text) {
      throw new Error('Failed to extract text from the resume');
    }
    const embeddingsModel = new OpenAIEmbeddings({ apiKey: OPENAI_API_KEY });

    // Generate embeddings for the given content
    const embeddings = await embeddingsModel.embedQuery(text);
    // Define the prompt for OpenAI
    const prompt = `
    Extract the following details from the provided resume text and return a well-structured JSON object. Ensure the extracted values are accurate and formatted correctly.
    
    Return JSON in this structure:
    {
      "name": "Full Name",
      "location": "City, Country",
      "email": "email@example.com",
      "phone": "Phone Number",
      "professional_summary": "Brief professional summary",
      "skills": ["Skill1", "Skill2", "Skill3"],
      "employment_history": [
        {
          "job_title": "Job Title",
          "company": "Company Name",
          "years": "Start Date - End Date",
          "description": "Job Description",
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "institution": "Institution Name",
          "years": "Start Date - End Date"
        }
      ],
      "preferences": {} // Extract any additional relevant details here.
    }
    
    Resume Text:
    ${text}
    `;

    // Send request to OpenAI
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI extracting resume details.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
    });

    // Extract JSON response
    const responseText = response.choices[0].message.content || '{}';
    const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
    const cleanJson = jsonMatch ? jsonMatch[1].trim() : responseText;
    const parsedJson = JSON.parse(cleanJson);
    await resumeRepository.uploadUserResume(userId, parsedJson, embeddings);
    // Parse JSON response safely
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error extracting resume data:', error);
    return null; // Return null or handle the error as needed
  }
};

const getUserResumes = async (userId: number) => {
  return await ResumeRepository.getUserResumes(userId);
};

export default { extractResumeData, getUserResumes };
