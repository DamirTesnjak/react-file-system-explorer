import { StateApp } from "./StateApp";

export interface DeleteDialogProps {
    open: boolean,
    setOpen: (a: boolean) => void,
    itemType: StateApp["itemType"];
    selectedItem: StateApp["selectedItem"];
    selectedItemFile: StateApp["selectedItemFile"];
    setState: (a: (b: StateApp) => StateApp) => void;
}