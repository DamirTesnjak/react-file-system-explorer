import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
} from "@mui/material";

import { createFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';

function CreateFolderDialog(props) {
  const { open, setOpen, state, setState } = props;
  const { currentPath } = state;

  const [folderName, setFolderName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setState({
      ...state,
      action: "",
    });
  };

  const handleConfirm = () => {
    if (folderName.length > 0) {
      createFolder({
        folderPath: `${currentPath}/${folderName}`,
      }).then((res) => {
        const error = res.data.err;
        console.log('error', error);
        if (!error) {
          setOpen(!open);
          setFolderName("");
          setState({
            ...state,
            ...resetedValues,
          });
        } else {
          setState({
            ...state,
            error,
            action: "",
          });
        }
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Create folder"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          New folder name...
        </DialogContentText>
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateFolderDialog;

CreateFolderDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  state: PropTypes.shape({
    currentPath: PropTypes.string,
  }),
  setState: PropTypes.func.isRequired,
};
