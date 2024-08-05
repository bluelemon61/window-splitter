import { BoxWindowObject } from "./BoxWindowObject";

export interface Splitter {
    isVertical: boolean,
    childs: (BoxWindowObject)[],
}