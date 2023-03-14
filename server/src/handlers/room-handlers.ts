import { Socket } from "socket.io";
import { RoomProps } from "../interfaces/room";
import { convertObjToArray, getAllRooms } from "../utils/functions";

export function handleRoom(socket: Socket, rooms: { [key: string]: RoomProps }, io: any) {
  socket.on('createRoom', (roomId: string, title: string) => {
    // verify room does not exist
    if (rooms[roomId]) {
      console.log('room already exists: ', roomId);
      socket.emit('roomAlreadyExists');
      return;
    }
    rooms[roomId] = {
      title: title,
      createdAt: new Date().toLocaleDateString(),
      nodes: {}
    };
    console.log('room created: ', roomId);
    const roomArray = getAllRooms(rooms);
    io.emit('allRooms', roomArray);
  });

  socket.on('joinRoom', (roomId: string) => {
    // verify room exists
    if (!rooms[roomId]) {
      console.log('room does not exist: ', roomId);
      socket.emit('roomDoesNotExist');
      return;
    }
    
    socket.join(roomId);
    const nodeArray = convertObjToArray(rooms[roomId].nodes);
    socket.emit('loadNodes', nodeArray);
    console.log('user joined room: ', roomId);
  });
}