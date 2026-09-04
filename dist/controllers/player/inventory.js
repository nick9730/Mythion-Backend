"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveInventory = exports.getInventory = void 0;
const zod_1 = require("zod");
const PlayerInventory_1 = __importDefault(require("../../models/PlayerInventory"));
const inventorySchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        itemId: zod_1.z.string(),
        itemName: zod_1.z.string(),
        quantity: zod_1.z.number().min(1),
        equipped: zod_1.z.boolean(),
    }))
});
// GET /api/player/inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await PlayerInventory_1.default.findOne({ playerId: req.playerId });
        if (!inventory) {
            res.status(404).json({ message: 'Inventory not found' });
            return;
        }
        res.json({ inventory });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getInventory = getInventory;
// PUT /api/player/inventory
const saveInventory = async (req, res) => {
    try {
        const validated = inventorySchema.parse(req.body);
        const inventory = await PlayerInventory_1.default.findOneAndUpdate({ playerId: req.playerId }, { $set: { items: validated.items } }, { returnDocument: 'after', upsert: true });
        res.json({ message: 'Inventory saved!', inventory });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.saveInventory = saveInventory;
