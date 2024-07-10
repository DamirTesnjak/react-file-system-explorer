import { JSX } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { style } from "./DialogStyle"
import { DialogProps } from "../../types/DialogProps";

export function DialogComponent(props: DialogProps): JSX.Element {
    const {
        open,
        handleClose,
        handleConfirm,
        titleText,
        dialogContentText,
    } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={style}
      >
        {titleText}
      </DialogTitle>
      <DialogContent sx={{ marginTop: "5px" }}>
        <DialogContentText id="alert-dialog-description">
          {dialogContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {handleConfirm && (<Button onClick={handleConfirm}>Ok</Button>)}
      </DialogActions>
    </Dialog>
  );
}

export default DialogComponent;