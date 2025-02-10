import { pool } from '../utils/database';
interface JobListing {
  title: string;
  company: string;
  location: string;
  salary: string | null;
  description: string;
  skills_required: string[];
  listingurl: string;
  posteddate: string;
  aboutrole: string;
  requirements: string;
}

interface Resume {
  name: string;
  user_location: string;
  email: string;
  phone: string;
  professional_summary: string;
  skills: string[];
  employment_history: Record<string, any>[];
  education: Record<string, any>[];
  preferences: Record<string, any>[];
  link: string;
  skill_level: string;
  uploaddate: string;
}

const getDetailsForResumeAndJob = async (
  jobId: string,
  userId: string
): Promise<{ jobListingText: JobListing; resumeText: Resume }> => {
  try {
    console.log('jobId', jobId, userId);
    const result = await pool.query(
      `
        SELECT 
            j.job_id, j.title, j.company, j.location, j.salary, j.description, 
            j.skills_required, j.listingurl, j.posteddate, j.aboutrole, j.requirements,
            r.id AS resume_id, r.name, r.location AS user_location, r.email, r.phone, 
            r.professional_summary, r.skills, r.employment_history, r.education, r.preferences, 
            r.link, r.skill_level, r.uploaddate
        FROM jobs j
        JOIN user_primary_resume upr ON upr.user_id = $2
        JOIN resumes r ON r.id = upr.resume_id
        WHERE j.job_id = $1;
        `,
      [jobId, userId]
    );

    console.log('result', result.rows);
    if (result.rows.length === 0) {
      throw new Error('No matching job or resume found.');
    }

    const row = result.rows[0];

    // Structuring the result into separate objects
    const jobListingText = {
      title: row.title,
      company: row.company,
      location: row.location,
      salary: row.salary,
      description: row.description,
      skills_required: row.skills_required,
      listingurl: row.listingurl,
      posteddate: row.posteddate,
      aboutrole: row.aboutrole,
      requirements: row.requirements,
    };

    const resumeText = {
      name: row.name,
      user_location: row.user_location,
      email: row.email,
      phone: row.phone,
      professional_summary: row.professional_summary,
      skills: Array.isArray(row.skills) ? row.skills : JSON.parse(row.skills),
      employment_history: Array.isArray(row.employment_history)
        ? row.employment_history
        : row.employment_history && typeof row.employment_history === 'string'
        ? JSON.parse(row.employment_history)
        : row.employment_history,
      education: Array.isArray(row.education)
        ? row.education
        : row.education && typeof row.education === 'string'
        ? JSON.parse(row.education)
        : row.education,
      preferences:
        typeof row.preferences === 'string'
          ? JSON.parse(row.preferences)
          : row.preferences,
      link: row.link,
      skill_level: row.skill_level,
      uploaddate: row.uploaddate,
    };

    return { jobListingText, resumeText };
  } catch (error: any) {
    console.error('Error fetching job and resume details:', error.message);
    throw new Error('Failed to fetch details.');
  }
};

export default {
  getDetailsForResumeAndJob,
};
