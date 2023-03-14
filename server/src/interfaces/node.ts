import { Coords } from "./common";

export interface NodeProps {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: any;
    zIndex: number;
  }
}
