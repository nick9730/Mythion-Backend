import { Response } from 'express';
import { z } from 'zod';
import PlayerQuest from '../../models/PlayerQuest';
import { AuthRequest } from '../../middleware/auth';
import { QuestStatus,IQuest } from '../../models/PlayerQuest';


const SingleQuestSchema = z.object({
    questId:   z.string(),
    questName: z.string(),
    status:    z.enum(QuestStatus),
});



// GET /api/player/quests,get
export const getQuests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {


        const playerQuests = await PlayerQuest.findOne({ playerId: req.playerId });

        if (!playerQuests) {
             res.json([]); 
           
             return;
        }
        
       res.json(playerQuests.quests)

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// PUT /api/player/quests, update
export const updateQuest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validated = SingleQuestSchema.parse(req.body);

        let playerQuest = await PlayerQuest.findOne({ playerId: req.playerId });
        
        if (!playerQuest) {
            playerQuest = new PlayerQuest({
                playerId: req.playerId,
                quests: []
            });
        }

        // 3. JavaScript Array Find (Αυτό που εξηγήσαμε πριν)
        const existingQuest = playerQuest.quests.find(q => q.questId === validated.questId);

    if (existingQuest) {
    if (existingQuest.status === 'Completed') {
        res.json({ 
            message: 'Quest is already completed so you change the status!', 
            playerQuest 
        });
        return; 
    }
    existingQuest.status = validated.status;
    existingQuest.questName = validated.questName; } 
    else {
    playerQuest.quests.push(validated);
    }
        playerQuest.markModified('quests'); 

     
        await playerQuest.set(playerQuest).save(); 

        res.json({ message: 'Quest log updated successfully!', playerQuest });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

