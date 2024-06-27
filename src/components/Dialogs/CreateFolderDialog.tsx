import React, { useState, JSX } from "react";
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
import { CreateFolderDialogProps } from "../../types/CreateFolderDialogProps";

function CreateFolderDialog(props: CreateFolderDialogProps): JSX.Element {
  const {
    open,
    setOpen,
    currentPath,
    setState,
  } = props;

  const [folderName, setFolderName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setState((prevState) => ({
      ...prevState,
      action: "",
    }));
  };


  const handleConfirm = () => {
    if (folderName.length > 0) {
      createFolder({ folderPath: `${currentPath}/${folderName}` })
        .then(() => {
            setOpen(!open);
            setFolderName("");
            setState((prevState) => ({
              ...prevState,
              ...resetedValues,
            }));
        }).catch((error) => {
          setState((prevState) => ({
            ...prevState,
            error,
            action: "",
          }));
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
      >{"Create folder"}</DialogTitle>
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
