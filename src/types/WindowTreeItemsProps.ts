import { UnknownAction } from "@reduxjs/toolkit";
import { DiskData } from "./DiskData";
import { FolderData } from "./FolderData";
import { Path } from "./Path";
import { ReducerItems } from "./ReducerItems";

export interface WindowTreeItemsProps {
    itemId: ReducerItems["itemId"];
    treeViewData?: (DiskData & FolderData)[];
    isFolder: boolean;
    isFile?: boolean;
    isDisk?: boolean;
    name: string;
    path: Path["path"];
    permission?: boolean;
    onClick?: () => void;
    expandedItems: ReducerItems["expandedItems"] ;
    visitedPaths: ReducerItems["visitedPaths"];
    setState:(state: Partial<ReducerItems>) => UnknownAction;
}