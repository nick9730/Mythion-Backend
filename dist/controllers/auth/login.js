"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const player_1 = __importDefault(require("../../models/player"));
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const login = async (req, res) => {
    try {
        const validated = loginSchema.parse(req.body);
        const loginplayer = await player_1.default.findOne({ username: validated.username });
        if (!loginplayer) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(validated.password, loginplayer.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: loginplayer._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful!',
            token,
            username: loginplayer.username,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation error', errors: error.issues });
            return;
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.default = login;
