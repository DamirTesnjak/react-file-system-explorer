import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { createFolder } from "../../data/methods";
import { Input } from "@mui/material";

function CreateFolderDialog(props) {
  const { open, setOpen, state, setState } = props;
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
        folderPath: `${state.currentPath}/${folderName}`,
      }).then((res) => {
        setOpen(false);
        setState({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          selectedFolder: null,
          action: "",
          itemType: null,
          folderData: [],
        });
        setFolderName("");
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
