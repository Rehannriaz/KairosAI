import { Router } from 'express';
import multer from 'multer';
import ResumeController from '../controllers/resume.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), ResumeController.processResume);
router.get('/', ResumeController.getUserResumes); // New route

export default router;
