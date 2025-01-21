import { Request, Response } from 'express';
import { processInterview } from '../services/interview.services';

const startInterview = async (req: Request, res: Response) => {
  const { userResponse } = req.body;

  try {
    console.log('Received user response:', userResponse);

    const response = await processInterview(userResponse);

    console.log('Response sent to client:', response);
    res.status(200).json({ res: response });
  } catch (error: any) {
    console.error('Error in startInterview:', error.message);
    res.status(500).json({ error: error.message });
  }
};
export default {
  startInterview,
};
