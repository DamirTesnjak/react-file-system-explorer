import { SetStateAction } from "react";
import { StateApp } from "./StateApp";

export interface WindowToolbarProps {
    currentPath: StateApp["currentPath"];
    currentPosition: StateApp["currentPosition"];
    visitedPaths: StateApp["visitedPaths"];
    action: StateApp["action"];
    error: StateApp["error"];
    itemType: StateApp["itemType"];
    selectedItem: StateApp["selectedItem"];
    selectedItemFile: StateApp["selectedItemFile"];
    selectedFolder: StateApp["selectedFolder"]; 
    setState: (value: SetStateAction<StateApp>) => void;
}