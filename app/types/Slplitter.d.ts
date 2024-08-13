import { BoxWindowObject } from "./BoxWindowObject";

export interface Splitter {
  scale: number;
  isVertical: boolean;
  childs: (BoxWindowObject | Splitter)[];
  address: string;
}
