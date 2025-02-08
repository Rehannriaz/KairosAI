import resumeController from '../controllers/resume.controller';
import { Router } from 'express';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage(); // Store file in memory, or use `diskStorage` to save locally
const upload = multer({ storage });

router.post('/upload', upload.single('file'), resumeController.processResume);
router.get('/', resumeController.getUserResumes); // New route
router.get('/:id', resumeController.getResumeById); // Get resume by ID
router.put('/:id', resumeController.updateResume); // Update resume
router.delete('/:id', resumeController.deleteResume); // Delete resume
export default router;
