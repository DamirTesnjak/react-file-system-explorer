import { UnknownAction } from "@reduxjs/toolkit";
import { DiskData } from "./DiskData";
import { FolderData } from "./FolderData"
import { ReducerItems } from "./ReducerItems";

export interface WindowTreeItemsArgs {
    folderData: (FolderData & DiskData)[] | undefined;
    itemId: ReducerItems["itemId"];
    expandedItems: ReducerItems["expandedItems"];
    visitedPaths: ReducerItems["visitedPaths"];
    setState:(state: Partial<ReducerItems>) => UnknownAction;
}