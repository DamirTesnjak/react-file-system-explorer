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

import { removeFile, deleteFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';
import getItemNameFromPath from '../../utils/getItemNameFromPath';

function DeleteDialog(props) {
  const { 
    open,
    setOpen,
    state,
    setState
  } = props;
  const { itemType, selectedItem, selectedItemFile } = state;

  const itemName = getItemNameFromPath(state.selectedItemFile);
  const itemTypeString = itemType === "file" ? 'file' : 'folder';

  const handleClose = () => {
    setOpen(false);
    setState({
      ...state,
      action: "",
    });
  };

  const handleConfirm = () => {
    const api = itemType === "file" ? removeFile : deleteFolder;
    api({
      path: itemType === "file" ? selectedItemFile?.path : selectedItem?.path,
    }).then((res) => {
      const error = res.data.err;
      if (!error) {
        setOpen(false);
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
  state: PropTypes.shape({
    itemType: PropTypes.string,
    selectedItem: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedItemFile: PropTypes.shape({
      path: PropTypes.string,
    }),
  }).isRequired,
  setState: PropTypes.func.isRequired,
};

DeleteDialog.defaultProps = {
  open: undefined,
};