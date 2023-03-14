import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { configureRoutes } from './server/express';
import { configureSockets } from './server/socket';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

configureRoutes(app);
configureSockets(io);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
