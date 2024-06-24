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
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(228,245,255,1) 98%)",
          height: "25px",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 600,
          paddingLeft: "20px",
        }}
      >{"Error"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>{`Name: ${state.error?.code}`}</p>
          <p>{`Message: ${state.error?.message}`}</p>
          <p>{`Name: ${state.error?.name}`}</p>
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
      code: PropTypes.string,
      message: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  setState: PropTypes.func.isRequired,
}
