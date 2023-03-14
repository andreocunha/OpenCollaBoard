import { NodeProps } from "../interfaces/node";
import { RoomProps } from "../interfaces/room";
import { COLORS } from "./colors";

export function removeNaoNumeros(str: string) {
  return str.replace(/\D/g, '');
}

export function getColorById(id: string) {
  // converte o ID em um número inteiro
  const num = parseInt(removeNaoNumeros(id));

  // calcula o índice da cor usando o resto da divisão do número pelo número de cores
  let index = num % COLORS.length;
  if (isNaN(index)) {
    index = 0;
  }

  // retorna a cor correspondente ao índice
  return COLORS[index];
}

export function convertObjToArray(data: NodeProps) {
  const newData = Object.entries(data).map(([id, cursor]) => ({
    id: id,
    type: cursor.type,
    position: {
      x: cursor.position.x,
      y: cursor.position.y,
    },
    data: cursor.data,
    zIndex: cursor.zIndex,
  }));
  return newData;
}


export function getAllRooms(rooms: { [key: string]: RoomProps }): any[] {
  // return an array of all room with id, title, and createdAt
  const roomArray: any[] = [];
  for (const roomId in rooms) {
    if (Object.prototype.hasOwnProperty.call(rooms, roomId)) {
      roomArray.push({
        id: roomId,
        title: rooms[roomId].title,
        createdAt: rooms[roomId].createdAt
      });
    }
  }
  return roomArray;
}