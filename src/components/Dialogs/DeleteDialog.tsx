import React, { JSX } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { removeFile, deleteFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';
import getItemNameFromPath from '../../utils/getItemNameFromPath';
import { DeleteDialogProps } from "../../types/DeleteDialogProps";

function DeleteDialog(props: DeleteDialogProps): JSX.Element {
  const { 
    open,
    setOpen,
    itemType,
    selectedItem,
    selectedItemFile,
    setState
  } = props;
  const itemName = getItemNameFromPath(selectedItemFile);
  const itemTypeString = itemType === "file" ? 'file' : 'folder';

  const handleClose = () => {
    setOpen(false);
    setState((prevState) => ({
      ...prevState,
      action: "",
    }));
  };

  const handleConfirm = () => {
    const api = itemType === "file" ? removeFile : deleteFolder;
    api({
      path: itemType === "file" ? selectedItemFile?.path : selectedItem?.path,
    }).then(() => {
        setOpen(false);
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
      >
        {"Delete..."}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Do you want to delete ${itemTypeString} ${itemName}?`}
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

DeleteDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  selectedItemFile: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  setState: PropTypes.func.isRequired,
};

DeleteDialog.defaultProps = {
  open: undefined,
};