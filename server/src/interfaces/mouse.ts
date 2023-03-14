import { Coords } from "./common";

export interface MouseProps {
  [id: string]: {
    id: string;
    type: string;
    position: Coords;
    data: {
      color: string;
    }
  }
}
