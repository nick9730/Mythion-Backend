import { Request,Response } from "express";
import ChatMessage from "../../models/ChatMessage";


export const getMessages = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const messages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    console.error('Get chat messages error:', err);
    res.status(500).json({ message: 'Failed to fetch chat messages' });
  }
};