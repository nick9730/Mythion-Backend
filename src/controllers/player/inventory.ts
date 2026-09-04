import { Response } from 'express';
import { z } from 'zod';
import PlayerInventory from '../../models/PlayerInventory';
import { InventorySlotType} from '../../models/PlayerInventory';
import { AuthRequest } from '../../middleware/auth';

const inventorySchema = z.object({
    items: z.array(z.object({
        itemId:   z.string(),
        itemName: z.string(),
        quantity: z.number().min(1),
        equipped: z.boolean(),
    slotType: z.enum(InventorySlotType).optional()
    }))
   
});

// GET /api/player/inventory
export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const inventory = await PlayerInventory.findOne({ playerId: req.playerId });

        if (!inventory) {
            res.status(404).json({ message: 'Inventory not found' });
            return;
        }

        res.json({ inventory });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// PUT /api/player/inventory
export const saveInventory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated = inventorySchema.parse(req.body);

       const inventory = await PlayerInventory.findOneAndUpdate(
        { playerId: req.playerId },
        { $set: { items: validated.items } }, 
        { returnDocument: 'after', upsert: true } 
    );

        res.json({ message: 'Inventory saved!', inventory });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};