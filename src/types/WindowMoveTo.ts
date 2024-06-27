import { StateApp } from "./StateApp";

export interface WindowMoveToProps {
    open: boolean;
    setOpen: (a: boolean) => void;
    itemType: StateApp["itemType"];
    selectedItem: StateApp["selectedItem"];
    selectedItemFile: StateApp["selectedItemFile"];
    selectedFolder: StateApp["selectedFolder"];
    setState: (a: (b: StateApp) => StateApp) => void;
}