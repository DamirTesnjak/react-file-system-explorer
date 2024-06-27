import { DiskData } from "./DiskData";
import { FolderData } from "./FolderData";
import { Path } from "./Path";
import { StateApp } from "./StateApp";

export interface WindowTreeItemsProps {
    itemId: StateApp["itemId"];
    treeViewData?: (DiskData & FolderData)[];
    isFolder: boolean;
    isFile?: boolean;
    isDisk?: boolean;
    name: string;
    path: Path["path"];
    setState: (a: (b: StateApp) => StateApp) => void;
    permission?: boolean;
    expandedItems: StateApp["expandedItems"];
    visitedPaths: StateApp["visitedPaths"];
    onClick?: () => void;
}