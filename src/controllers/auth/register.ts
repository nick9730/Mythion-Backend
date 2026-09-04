import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import player from '../../models/player';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username too long'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    isNewPlayer: z.boolean().default(true),
    
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']

    
});

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated = registerSchema.parse(req.body);

        const existing = await player.findOne({
            $or: [{ username: validated.username }, { email: validated.email }]
        });

        if (existing) {
            res.status(400).json({ message: 'Username or email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);
        const createdPlayer = await player.create({
            username: validated.username,
            email:    validated.email,
            password: hashedPassword,
            isNewPlayer : true,
            
        });

        const token = jwt.sign(
            { id: createdPlayer._id.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message:  'Account created!',
            token,
            username: createdPlayer.username,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export default register;