import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { removeFile } from "../../data/methods";

function DeleteDialog(props) {
  const { open, setOpen, state, setState } = props;

  const handleClose = () => {
    setOpen(false);
    setState({
      ...state,
      action: "",
    });
  };

  const handleConfirm = () => {
    removeFile({
      path: state.selectedItem?.path,
    }).then((res) => {
      setOpen(false);
      setState({
        ...state,
        action: "",
      });
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you want to delete file {state.fileName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
