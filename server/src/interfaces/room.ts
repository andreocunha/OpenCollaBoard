import { NodeProps } from "./node";

export interface RoomProps {
  title: string;
  createdAt: string;
  nodes: NodeProps;
}