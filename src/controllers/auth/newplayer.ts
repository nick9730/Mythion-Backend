import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import player from '../../models/player';

const updateFirstLogin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('Updating player:', req.playerId);
        const result = await player.findByIdAndUpdate(req.playerId, { isNewPlayer: false });
        console.log('Result:', result);
        res.json({ message: 'Player updated!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export default updateFirstLogin;