import { BoxObject } from "./BoxObject";

export interface BoxWindowObject {
  scale?: number | undefined;
  childs: BoxObject[];
  address: string;
}
