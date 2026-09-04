import { Router } from 'express';
import { register, login, logout, updateFirstLogin } from '../controllers/auth';
import auth from '../middleware/auth';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout)
router.put('/newplayer', auth, updateFirstLogin);


export default router;