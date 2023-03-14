import { Server } from 'socket.io';
import { handleMouseMove } from '../handlers/mouse-handlers';
import { handleNode } from '../handlers/node-handlers';
import { handleRoom } from '../handlers/room-handlers';
import { RoomProps } from '../interfaces/room';
import { getAllRooms } from '../utils/functions';

export function configureSockets(io: Server): void {
  let rooms: { [key: string]: RoomProps } = {};

  io.on('connection', (socket: any) => {
    console.log('new user: ', socket.id);
    
    // wait 1 second and emit all rooms id as array
    setTimeout(() => {
      const roomArray = getAllRooms(rooms);
      socket.emit('allRooms', roomArray);
    }, 1000);

    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);
      for (const roomId in rooms) {
        if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
          delete rooms[roomId].nodes[socket.id];
        }
      }
      io.emit('userDisconnect', socket.id as string);
    });

    handleRoom(socket, rooms, io);
    handleMouseMove(socket);
    handleNode(socket, rooms, io);
  });
}
