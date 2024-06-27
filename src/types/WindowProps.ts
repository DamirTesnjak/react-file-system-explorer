import { SetStateAction } from "react";
import { StateApp } from "./StateApp";

export interface WindowProps {
    state: StateApp;
    setState: (value: SetStateAction<StateApp>) => void;
}