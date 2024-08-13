import { BoxObject } from "./BoxObject";

export interface BoxWindowObject {
  scale: number;
  fold: boolean;
  selected: number;
  childs: BoxObject[];
  address: string;
}
