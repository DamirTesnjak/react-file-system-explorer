import { StateApp } from "./StateApp";

export interface CreateFolderDialogProps {
    open: boolean;
    setOpen: (a: boolean) => void;
    currentPath: StateApp["currentPath"];
    setState: (a: (b: StateApp) => StateApp) => void;
}