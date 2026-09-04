"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const player_1 = require("../controllers/player");
const player_2 = require("../controllers/player");
const player_3 = require("../controllers/player");
const router = (0, express_1.Router)();
// All player routes require JWT token
router.use(auth_1.default);
// Stats
router.get('/stats', player_1.getStats);
router.put('/stats', player_1.saveStats);
// Inventory
router.get('/inventory', player_2.getInventory);
router.put('/inventory', player_2.saveInventory);
// Quests
router.get('/quests', player_3.getQuests);
router.put('/quests', player_3.updateQuest);
exports.default = router;
