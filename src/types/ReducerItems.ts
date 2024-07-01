import { DiskData } from "./DiskData";
import { Error } from "./Error";
import { FolderData } from "./FolderData";
import { Path }  from "./Path";

export interface ReducerItems {
    [x: string]: any,
    dialogOpened: boolean;
    oldPath: string | undefined;
    currentPath: string | null;
    itemId: string;
    visitedPaths: string[],
    currentPosition: number;
    expandedItems: string[];
    selectedItem: Path | null;
    selectedItemFile: Path | null;
    selectedFolder: string | null;
    itemType: string | null;
    doubleClick: number;
    folderData: FolderData[] | never[];
    diskData: DiskData[] | never[];
    action: string;
    error: Error | null;
}