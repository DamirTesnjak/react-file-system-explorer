import React, { useState } from 'react';
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowTitle from "../WindowTitle/WindowTitle";
import { moveFile, moveFolder } from "../../data/methods";

function WindowMoveTo(props) {
  const { state, open, setOpen, setState } = props;
  const { itemType, selectedItem, selectedItemFile } = state;

  const [stateDialog, setStateDialog] = useState({
    oldPath: selectedItem?.path || selectedItemFile?.path,
    currentPath: '',        // holds the current path pf a visited folder
    itemId: '',
    visitedPaths: [],       // holds zhe array of visited paths during the session
    currentPosition: 0,     // used as index in "visitedPaths" to get prevous visited path when navigating back in "history"
    expandedItems: [],      // holds value of all expanded items in "TreeView"
    selectedItem: null,     // holds the data of a selected item after one click
    selectedFolder: null,   // holds the data of a selected folder after one click
    itemType: null,         // type of selected item, "folder" or "file" as string
    doubleClick: 0,         // used to detect when double click happens
    folderData: [],         // contains array of item to be displayed in window
    action: '',             // action "copy", "paste", "delete", "create"
    error: null,            // hold any kind off error to be displayed on screen, when something goes wrong
  });

  const handleClose = () => {
    setOpen(false);
    setState({
      ...state,
      action: "",
    });
  };

  const handleConfirm = () => {
    const selecedItemPathArr = state.selectedItemFile?.path.split("/");
    const selectedItemFilename = selecedItemPathArr ? selecedItemPathArr[selecedItemPathArr.length - 1] : '';
    const api = itemType === "file" ? moveFile : moveFolder;
    api({
      oldPath: stateDialog.oldPath,
      newPath:  itemType === "file" ? `${stateDialog.currentPath}/${selectedItemFilename}` : stateDialog.currentPath,
    }).then((res) => {
      if (!res.data.err) {
        setOpen(false);
        setStateDialog({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          action: "",
          itemType: null,
          folderData: [],
          moveToPath: null,
        });
        setState({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          action: "",
          itemType: null,
          folderData: [],
          moveToPath: null,
        });
      } else {
        setOpen(false);
        setStateDialog({
          ...state,
          error: res.data.err,
          action: "",
        });
        setState({
          ...state,
          error: res.data.err,
          action: "",
        });
      }
    });
  };

  console.log('stateDialog', stateDialog);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",  // Set your width here
          },
        },
      }}
    >
      <DialogContent sx={{ padding: '2px' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "#c0c7c8" }}>
          <Grid item xs={12}>
            <WindowTitle state={stateDialog} />
          </Grid>
          <Grid item xs={12}>
            <WindowTreeView state={stateDialog} setState={setStateDialog} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default WindowMoveTo;

WindowMoveTo.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  state: PropTypes.shape({
    selectedItem: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedItemFile: PropTypes.shape({
      path: PropTypes.string,
    }),
    itemType: PropTypes.string,
  }),
};
