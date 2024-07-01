import { ReducerItems } from "./ReducerItems";

export interface WindowMoveToProps {
    open: boolean;
    setOpen: (a: boolean) => void;
    itemType: ReducerItems["itemType"];
    selectedItem: ReducerItems["selectedItem"];
    selectedItemFile: ReducerItems["selectedItemFile"];
    selectedFolder: ReducerItems["selectedFolder"];
}