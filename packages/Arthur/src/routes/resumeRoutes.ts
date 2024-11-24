import { Router } from 'express';
import { 
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume
} from '../controllers/resume.controller'; // Import functions directly

const router = Router();

router.get('/', getAllResumes); // Get all resumes
router.get('/:id', getResumeById); // Get resume by ID
router.post('/', createResume); // Create new parsed resume
router.put('/:id', updateResume); // Update resume
router.delete('/:id', deleteResume); // Delete resume

export default router;
