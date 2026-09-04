import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';

const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.json({ message: 'Logged out successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export default logout;