import { Path } from "../types/Path";
import { StateApp } from "./StateApp";

export interface IconCardProps {
    isFolder?: boolean;
    isFile?: boolean;
    isDisk: boolean;
    name: string;
    itemId: string;
    onClick?: () => void;
    onMouseLeave?: () => void;
    setState: (a: (b: StateApp) => StateApp) => void;
    path: Path["path"];
    permission: boolean;
    visitedPaths?: StateApp["visitedPaths"];
    selectedItem?: StateApp["selectedItem"];
    selectedItemFile?: StateApp["selectedItemFile"];
    currentPath?: StateApp["currentPath"];
}