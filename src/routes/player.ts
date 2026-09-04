import { Router } from 'express';
import auth from '../middleware/auth';
import { getStats, saveStats } from '../controllers/player';
import { getInventory, saveInventory } from '../controllers/player';
import { getQuests, updateQuest } from '../controllers/player';

const router = Router();

// All player routes require JWT token
router.use(auth);

// Stats
router.get('/stats', getStats);
router.put('/stats', saveStats);

// Inventory
router.get('/inventory', getInventory);
router.put('/inventory', saveInventory);

// Quests
router.get('/quests', getQuests);
router.put('/quests', updateQuest);

export default router;