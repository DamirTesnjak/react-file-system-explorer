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

import { removeFile, deleteFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';
import getItemNameFromPath from '../../utils/getItemNameFromPath';
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";
import { DialogProps } from "../../types/DeleteDialog";

function DeleteDialog(props: DialogProps): JSX.Element {
  // getting state variables from react-redux store
  const state = useSelector((state: { appState: ReducerItems }) => ({
    itemType: state.appState.itemType,
    selectedItem: state.appState.selectedItem,
    selectedItemFile: state.appState.selectedItemFile,
  }), shallowEqual);

  const { open, setOpen } = props;

  const { itemType, selectedItem, selectedItemFile } = state;
  
  const dispatch = useDispatch();
  const itemName = getItemNameFromPath(selectedItemFile);
  const itemTypeString = itemType === "file" ? 'file' : 'folder';

  const handleClose = () => {
    setOpen(false);
    dispatch(setState({
      action: "",
    }));
  };

  const handleConfirm = () => {
    const api = itemType === "file" ? removeFile : deleteFolder;
    api({
      path: itemType === "file" ? selectedItemFile?.path : selectedItem?.path,
    }).then(() => {
        setOpen(false);
        dispatch(setState({
          ...resetedValues,
        }));
    }).catch((error) => {
      dispatch(setState({
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
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >
        {"Delete..."}
      </DialogTitle>
      <DialogContent sx={{ marginTop: "5px" }}>
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
