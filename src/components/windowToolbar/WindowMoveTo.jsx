import React, { useState } from 'react';
import { 
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";

import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowTitle from "../WindowTitle/WindowTitle";
import { moveFile, moveFolder } from "../../data/methods";
import { initialValues, resetedValues } from '../../constants/constants';
import getItemNameFromPath from '../../utils/getItemNameFromPath';


function WindowMoveTo(props) {
  const { 
    open,
    setOpen,
    itemType,
    selectedItem,
    selectedItemFile,
    selectedFolder,
    setState,
  } = props;

  const [stateDialog, setStateDialog] = useState({
    ...initialValues,
    oldPath: selectedItem?.path || selectedItemFile?.path,
  });

  const { 
    currentPath,
    expandedItems,
    visitedPaths,
    diskData,
  } = stateDialog;

  const handleClose = () => {
    setOpen(false);
    setState((prevState) => ({
      ...prevState,
      action: "",
    }));
  };

  const handleConfirm = () => {
    const itemName = getItemNameFromPath(itemType === "file" ? selectedItemFile : { path: selectedFolder})
    const api = itemType === "file" ? moveFile : moveFolder;
    api({
      oldPath: stateDialog.oldPath,
      newPath:  `${currentPath}/${itemName}`,
    }).then(() => {
        setOpen(false);
        setStateDialog((prevState) => ({
          ...prevState,
          ...resetedValues,
        }));
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
            <WindowTitle currentPath={currentPath} />
          </Grid>
          <Grid item xs={12}>
            <WindowTreeView
              dialogOpened={open}
              expandedItems={expandedItems}
              visitedPaths={visitedPaths}
              disksData={diskData}
              setState={setStateDialog}
            />
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
  selectedItem: PropTypes.shape({
    path: PropTypes.string,
  }),
  selectedItemFile: PropTypes.shape({
    path: PropTypes.string,
  }),
  selectedFolder: PropTypes.string,
  itemType: PropTypes.string,
};
