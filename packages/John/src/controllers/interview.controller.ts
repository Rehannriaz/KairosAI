import interviewServices from '../services/interview.services';
import { Request, Response } from 'express';

const startInterview = async (req: any, res: any) => {
  const { userResponse, interviewID, jobID } = req.body;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const response = await interviewServices.processInterview(
      req.user,
      jobID,
      userResponse,
      interviewID
    );
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
const getInterviewsData = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const chats = await interviewServices.getInterviewsData(req.user);
    res.status(200).json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const streamInterview = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { userResponse, interviewID, jobID } = req.body;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Start the streaming process
    await interviewServices.streamInterview(
      req.user,
      jobID,
      userResponse,
      interviewID,
      res // Pass the response object to write chunks
    );

    // End the response when streaming is complete
    res.end();
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.end(`Error: ${error.message}`);
    }
  }
};
const saveStreamedInterview = async (req: any, res: any) => {
  const { userResponse, interviewID, jobID } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await interviewServices.saveStreamedInterview(
      req.user,
      jobID,
      userResponse,
      interviewID
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error saving streamed interview:', error.message);
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
  getInterviewsData,
  streamInterview,
  saveStreamedInterview,
};
