export interface DialogProps {
    open: boolean;
    handleClose?: () => void;
    handleConfirm?: () => void;
    titleText?: string;
    dialogContentText?: JSX.Element | string;
}