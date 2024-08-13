import { BoxObject } from "./BoxObject";

export interface BoxWindowObject {
  scale?: number | undefined;
  fold: boolean;
  selected: number;
  childs: BoxObject[];
  address: string;
}
