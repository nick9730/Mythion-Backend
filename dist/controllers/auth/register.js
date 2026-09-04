"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const player_1 = __importDefault(require("../../models/player"));
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username too long'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod_1.z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});
const register = async (req, res) => {
    try {
        const validated = registerSchema.parse(req.body);
        const existing = await player_1.default.findOne({
            $or: [{ username: validated.username }, { email: validated.email }]
        });
        if (existing) {
            res.status(400).json({ message: 'Username or email already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(validated.password, 10);
        const createdPlayer = await player_1.default.create({
            username: validated.username,
            email: validated.email,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ id: createdPlayer._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Account created!',
            token,
            username: createdPlayer.username,
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
exports.default = register;
