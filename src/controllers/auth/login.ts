import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import player from '../../models/player';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated = loginSchema.parse(req.body);

        const loginplayer = await player.findOne({ username: validated.username });
        if (!loginplayer) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(validated.password, loginplayer.password as string);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: loginplayer._id.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.json({
            message:  'Login successful!',
            token,
            username: loginplayer.username,
            isNewPlayer : loginplayer.isNewPlayer
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export default login;