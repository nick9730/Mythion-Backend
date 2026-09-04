import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import playerRoutes from './routes/player';
import chatRoutes from './routes/chat';
import http from 'http';
import { Server } from 'socket.io';
import { registerChatHandlers } from './socket/chat';


const app = express();

// Syndesh sth vash
connectDB();

// Middlewaresss 
app.use(cors());
app.use(express.json());

// Routes  gia ta tou player kai to auth
app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/chat',chatRoutes);

//  route dokimhs
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

const httpServer = http.createServer(app)
const  io = new Server (httpServer,
    {
        cors:{
            origin:'*'
        },
    });


registerChatHandlers(io);

// Start server kanonika
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});