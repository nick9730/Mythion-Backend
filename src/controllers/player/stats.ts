import { Response } from 'express';
import { z } from 'zod';
import PlayerStats from '../../models/PlayerStats';
import { AuthRequest } from '../../middleware/auth';

const statsSchema = z.object({
    className: z.string().optional(),
    gender: z.string().optional(),
    level: z.number().min(1),
    xp: z.number().min(0),
    health: z.number().min(0),
    mana: z.number().min(0),
    armor: z.number().min(0),
    coins: z.number().min(0),
    magicResist: z.number().min(0),
    lastLocation: z.object({
        x: z.number(),
        y: z.number(),
        z: z.number()
    }).optional(),

});

// GET /api/player/stats, only get
export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const stats = await PlayerStats.findOne({ playerId: req.playerId });
        if (!stats) {
            res.status(404).json({ message: 'Stats not found' });
            return;
        }

        res.json({ stats });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// PUT /api/player/stats , only update , never post
export const saveStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('Received body:', JSON.stringify(req.body, null, 2));

        const validated = statsSchema.parse(req.body);



        const stats = await PlayerStats.findOneAndUpdate(
            { playerId: req.playerId },
            { $set: validated },
            { new: true, upsert: true }
        );

        console.log('Validated:', validated);
        console.log('Stats saved:', stats);

        res.json({ message: 'Stats saved!', stats });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};