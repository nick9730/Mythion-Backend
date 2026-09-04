
import { Router } from 'express';
import auth  from '../middleware/auth';
import { getMessages } from '../controllers/chat/chatController';

const router = Router();

router.use(auth);

router.get('/messages', getMessages);

export default router;