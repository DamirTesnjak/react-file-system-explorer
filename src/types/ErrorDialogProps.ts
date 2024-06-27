import { StateApp } from "./StateApp";
import { Error } from "./Error";

export interface ErrorDialogProps {
    open: boolean;
    error: Error;
    setState: (a: (b: StateApp) => StateApp) => void;
}