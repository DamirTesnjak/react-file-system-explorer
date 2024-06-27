import { StateApp } from "./StateApp";

export interface WindowContentIconViewProps {
    currentPath: StateApp["currentPath"];
    folderData: StateApp["folderData"];
    disksData: StateApp["diskData"];
    doubleClick: StateApp["doubleClick"];
    visitedPaths: StateApp["visitedPaths"];
    selectedFolder: StateApp["selectedFolder"];
    selectedItem: StateApp["selectedItem"];
    selectedItemFile: StateApp["selectedItemFile"];
    action: StateApp["action"];
    setState: (a: (b: StateApp) => StateApp) => void;
}