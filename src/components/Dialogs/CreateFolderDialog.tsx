import { useState, JSX } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
} from "@mui/material";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { createFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";
import { DialogProps } from "../../types/DeleteDialog";

function CreateFolderDialog(props: DialogProps): JSX.Element {
  const { open, setOpen } = props;

  // getting state variable from react-redux store
  const currentPath = useSelector((state: { appState: ReducerItems }) => state.appState.currentPath, shallowEqual);
  
  const dispatch = useDispatch();

  const [folderName, setFolderName] = useState("");

  const handleClose = () => {
    setOpen(false);
    dispatch(setState({
      action: "",
    }));
  };


  const handleConfirm = () => {
    if (folderName.length > 0) {
      createFolder({ folderPath: `${currentPath}/${folderName}` })
        .then(() => {
            setOpen(!open);
            setFolderName("");
            dispatch(setState({
              ...resetedValues,
            }));
        }).catch((error) => {
          dispatch(setState({
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
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
      >{"Create folder"}</DialogTitle>
      <DialogContent sx={{ marginTop: "5px" }}>
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
