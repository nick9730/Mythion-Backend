"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuest = exports.getQuests = void 0;
const zod_1 = require("zod");
const PlayerQuest_1 = __importDefault(require("../../models/PlayerQuest"));
const PlayerQuest_2 = require("../../models/PlayerQuest");
const SingleQuestSchema = zod_1.z.object({
    questId: zod_1.z.string(),
    questName: zod_1.z.string(),
    status: zod_1.z.enum(PlayerQuest_2.QuestStatus),
});
// GET /api/player/quests,get
const getQuests = async (req, res) => {
    try {
        const playerQuests = await PlayerQuest_1.default.findOne({ playerId: req.playerId });
        if (!playerQuests) {
            res.json([]);
            return;
        }
        res.json(playerQuests.quests);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getQuests = getQuests;
// PUT /api/player/quests, update
const updateQuest = async (req, res) => {
    try {
        const validated = SingleQuestSchema.parse(req.body);
        let playerQuest = await PlayerQuest_1.default.findOne({ playerId: req.playerId });
        if (!playerQuest) {
            playerQuest = new PlayerQuest_1.default({
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
            existingQuest.questName = validated.questName;
        }
        else {
            playerQuest.quests.push(validated);
        }
        playerQuest.markModified('quests');
        await playerQuest.set(playerQuest).save();
        res.json({ message: 'Quest log updated successfully!', playerQuest });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateQuest = updateQuest;
