import { Socket } from 'socket.io';
import { RoomProps } from '../interfaces/room';

export function handleNode(socket: Socket, rooms: { [key: string]: RoomProps }, io: any) {
  // listen for node
  socket.on('nodeEvent', async (node: any) => {
    try {
      // console.log('nodeEvent: ', node);
      const roomId = Array.from(socket.rooms)[1];
      let nodeFromRoom = rooms[roomId].nodes[node.id];
      // if node already exists, update only the properties changed
      if (nodeFromRoom) {
        rooms[roomId].nodes[node.id] = { ...nodeFromRoom, ...node };
      }
      else {
        rooms[roomId].nodes[node.id] = node;
      }
      if (rooms[roomId].nodes[node.id].type !== undefined) {
        io.to(roomId).emit('nodeCoords', rooms[roomId].nodes[node.id]);
      }
    }
    catch (err) {
      console.log('nodeEvent ERRO: ', err);
    }
  });

  socket.on('nodeMove', async (node: any) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      let nodeFromRoom = rooms[roomId].nodes[node.id];
      // update only the properties changed
      nodeFromRoom = { ...nodeFromRoom, ...node };
      rooms[roomId].nodes[node.id] = nodeFromRoom;
      if (rooms[roomId].nodes[node.id].type !== undefined) {
        socket.to(roomId).emit('nodeCoords', nodeFromRoom);
      }
    }
    catch (err) {
      console.log('nodeMove ERRO: ', err);
    }
  });

  socket.on('nodeLiked', async (nodeId: string, increment: boolean) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      const node = rooms[roomId].nodes[nodeId];
      if (increment) {
        node.data.likes++;
      }
      else if (node.data.likes > 0) {
        node.data.likes--;
      }
      io.to(roomId).emit('nodeCoords', node);
    }
    catch (err) {
      console.log('nodeLiked ERRO: ', err);
    }
  });

  socket.on('nodeDelete', async (nodeId: string) => {
    try {
      const roomId = Array.from(socket.rooms)[1];
      delete rooms[roomId].nodes[nodeId];
      socket.to(roomId).emit('nodeDeleted', nodeId);
    }
    catch (err) {
      console.log('nodeDelete ERRO: ', err);
    }
  });
}
