"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.default = logout;
