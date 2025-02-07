import OpenAI from 'openai';
import fileParser from '../utils/fileParser';
import ResumeRepository from '../repositories/resume.repository';
import dotenv from 'dotenv';

dotenv.config();

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ResumeService {
  static async extractResumeData(file: Express.Multer.File) {
    const text = await fileParser.extractText(file);

    if (!text) {
      throw new Error('Failed to extract text from the resume');
    }

    const prompt = `
    Extract the following details from the given resume text in JSON format:
    - Name
    - Location
    - Email
    - Phone
    - Professional Summary
    - Skills (as an array)
    - Employment History (as an array of {job_title, company, years})
    - Education (as an array of {degree, institution, years})

    Resume Text:
    ${text}
    `;

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

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  static async getUserResumes(userId: number) {
    return await ResumeRepository.getUserResumes(userId);
  }
}

export default ResumeService;
