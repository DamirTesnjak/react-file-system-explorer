import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { removeFile, deleteFolder } from "../../data/methods";

function DeleteDialog(props) {
  const { open, setOpen, state, setState } = props;
  const { itemType, selectedItem, selectedItemFile } = state;

  const selecedItemPathArr = state.itemType === 'file' ? selectedItemFile?.path.split("/") : selectedItem?.path.split("/");
  const selectedItemName = selecedItemPathArr ? selecedItemPathArr[selecedItemPathArr.length - 1] : '';

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
      if (!res.data.err) {
        setOpen(false);
        setState({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          action: "",
          itemType: null,
          folderData: [],
        });
      } else {
        setState({
          ...state,
          error: res.data.err,
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
          Do you want to delete file {selectedItemName}?
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