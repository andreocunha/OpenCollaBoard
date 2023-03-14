export interface Coords {
  x: number;
  y: number;
}

export interface MouseCoords {
  id: string;
  type: string;
  position: Coords;
  data: {
    color: string;
  }
}

export interface NodeProps {
  id: string;
  type: string;
  position: Coords;
  data: any;
}

export interface GenericNode {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: any
  }
}

