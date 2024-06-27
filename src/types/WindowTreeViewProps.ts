import { SetStateAction } from "react";
import { StateApp } from "./StateApp"

export interface WindowTreeViewProps {
    dialogOpened?: boolean;
    expandedItems: string[];
    visitedPaths: StateApp["visitedPaths"];
    disksData: StateApp["diskData"];
    setState: (value: SetStateAction<StateApp>) => void;
}