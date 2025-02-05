import interviewServices from '../services/interview.services';
import { Request, Response } from 'express';

const startInterview = async (req: any, res: any) => {
  const { userResponse, interviewID, jobID } = req.body;
  try {
    console.log('Received user response:', userResponse);
    const response = await interviewServices.processInterview(
      userResponse,
      interviewID,
      req.user,
      jobID
    );
    console.log('Response sent to client:', response);
    res.status(200).json({ res: response });
  } catch (error: any) {
    console.error('Error in startInterview:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getAllChatsForJob = async (req: any, res: any) => {
  const { jobID } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const chats = await interviewServices.fetchChatsForJob(jobID, req.user);
    res.status(200).json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const initiateInterview = async (req: any, res: any) => {
  const { jobID } = req.body;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const response = await interviewServices.initiateInterview(jobID, req.user);
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error in initiateInterview:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getChatForJob = async (req: any, res: any) => {
  const { jobID, chatID } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const chat = await interviewServices.fetchChatForJob(
      jobID,
      chatID,
      req.user
    );
    res.status(200).json(chat);
  } catch (error: any) {
    console.error('Error fetching chat:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteChatForJob = async (req: any, res: any) => {
  const { chatID } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const response = await interviewServices.deleteChatForJob(chatID, req.user);
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error in deleteChatForJob:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export default {
  startInterview,
  getAllChatsForJob,
  getChatForJob,
  initiateInterview,
  deleteChatForJob,
};
