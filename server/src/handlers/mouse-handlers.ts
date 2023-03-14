import { Coords } from '../interfaces/common';
import { Socket } from 'socket.io';
import { getColorById } from '../utils/functions';

export function handleMouseMove(socket: Socket) {
  socket.on('mouseMove', async (coords: Coords) => {
    const roomId = Array.from(socket.rooms)[1];
    const mouseInfo = {
      id: socket.id,
      type: 'cursor',
      position: coords,
      data: {
        color: getColorById(socket.id),
      },
      zIndex: 5000,
    }
    socket.to(roomId).emit('nodeCoords', mouseInfo);
  });
}
