"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStats = exports.getStats = void 0;
const zod_1 = require("zod");
const PlayerStats_1 = __importDefault(require("../../models/PlayerStats"));
const statsSchema = zod_1.z.object({
    className: zod_1.z.string(),
    gender: zod_1.z.string(),
    level: zod_1.z.number().min(1),
    xp: zod_1.z.number().min(0),
    health: zod_1.z.number().min(0),
    mana: zod_1.z.number().min(0),
    armor: zod_1.z.number().min(0),
    coins: zod_1.z.number().min(0),
    magicResist: zod_1.z.number().min(0),
});
// GET /api/player/stats, only get
const getStats = async (req, res) => {
    try {
        const stats = await PlayerStats_1.default.findOne({ playerId: req.playerId });
        if (!stats) {
            res.status(404).json({ message: 'Stats not found' });
            return;
        }
        res.json({ stats });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getStats = getStats;
// PUT /api/player/stats , only update , never post
const saveStats = async (req, res) => {
    try {
        const validated = statsSchema.parse(req.body);
        const stats = await PlayerStats_1.default.findOneAndUpdate({ playerId: req.playerId }, { $set: validated }, { new: true, upsert: true });
        res.json({ message: 'Stats saved!', stats });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.saveStats = saveStats;
