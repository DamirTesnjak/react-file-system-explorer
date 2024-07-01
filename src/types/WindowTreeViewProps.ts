import { UnknownAction } from "@reduxjs/toolkit";
import { ReducerItems } from "./ReducerItems"

export interface WindowTreeViewProps {
    state: {
        visitedPaths: ReducerItems["visitedPaths"],
        expandedItems: ReducerItems["expandedItems"];
        diskData: ReducerItems["diskData"];
    };
    setState:(state: Partial<ReducerItems>) => UnknownAction;
}