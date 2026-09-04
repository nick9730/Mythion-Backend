"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const player_1 = __importDefault(require("./routes/player"));
const app = (0, express_1.default)();
// Syndesh sth vash
(0, database_1.default)();
// Middlewaresss 
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes  gia ta tou player kai to auth
app.use('/api/auth', auth_1.default);
app.use('/api/player', player_1.default);
//  route dokimhs
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});
// Start server kanonika
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
