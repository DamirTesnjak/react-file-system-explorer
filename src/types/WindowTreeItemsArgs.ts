import { DiskData } from "./DiskData";
import { FolderData } from "./FolderData"
import { StateApp } from "./StateApp";

export interface WindowTreeItemsArgs {
    folderData: (FolderData & DiskData)[] | undefined;
    itemId: StateApp["itemId"];
    expandedItems: StateApp["expandedItems"];
    visitedPaths: StateApp["visitedPaths"];
    setState: (a: (b: StateApp) => StateApp) => void;
}