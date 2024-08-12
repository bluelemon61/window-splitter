import { BoxObject } from "./BoxObject";

export interface BoxWindowObject {
  scale?: number | undefined;
  selected: number;
  childs: BoxObject[];
  address: string;
}
