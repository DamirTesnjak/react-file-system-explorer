import { SetStateAction } from "react";
import { StateApp } from "./StateApp";

export interface WindowAddressBarProps {
    currentPath: StateApp["currentPath"];
    visitedPaths: StateApp["visitedPaths"];
    setState: (a: (b: StateApp) => StateApp) => void;
}