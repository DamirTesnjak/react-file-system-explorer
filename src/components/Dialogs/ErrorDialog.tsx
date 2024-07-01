import { JSX } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { ErrorDialogProps } from "../../types/ErrorDialogProps";
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";

function ErrorDialog(props: ErrorDialogProps): JSX.Element {
  const { open } = props;
  const error = useSelector((state: { appState: ReducerItems }) => state.appState.error, shallowEqual);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setState({
      error: null,
    }));
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
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >{"Error"}</DialogTitle>
      <DialogContent sx={{ marginTop: "5px" }}>
        <DialogContentText id="alert-dialog-description">
          <p>{`Name: ${error?.code}`}</p>
          <p>{`Message: ${error?.message}`}</p>
          <p>{`Name: ${error?.name}`}</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;
