import { JSX } from "react";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { removeFile, deleteFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';
import getItemNameFromPath from '../../utils/getItemNameFromPath';
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";
import { DialogComponent } from "../Dialogs/Dialog";

function DeleteDialog(props: {
  open: boolean;
  setOpen: (a: boolean) => void;
}): JSX.Element {
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
    <DialogComponent
      open={open}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      titleText="Delete..."
      dialogContentText={`Do you want to delete ${itemTypeString} ${itemName}?`}
    />
  );
}

export default DeleteDialog;
