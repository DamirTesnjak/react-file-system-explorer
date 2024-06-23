import * as React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ErrorDialog(props) {
  const { open, state, setState } = props;

  const handleClose = () => {
    setState({
      ...state,
      error: null,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>{`Errno: ${state.error?.errno}`}</p>
          <p>{`Code: ${state.error?.code}`}</p>
          <p>{`Syscall: ${state.error?.syscall}`}</p>
          <p>{`Path: ${state.error?.path}`}</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;

ErrorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  state: PropTypes.shape({
    error: PropTypes.shape({
      errno: PropTypes.number,
      code: PropTypes.string,
      syscall: PropTypes.string,
      path: PropTypes.string,
    }),
  }).isRequired,
  setState: PropTypes.func.isRequired,
}