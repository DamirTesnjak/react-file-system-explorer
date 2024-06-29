import { 
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { moveFile, moveFolder } from "../../data/methods";
import { resetedValues } from '../../constants/constants';
import getItemNameFromPath from '../../utils/getItemNameFromPath';
import { StateApp } from '../../types/StateApp';
import { setState } from "../../app/appSlice";
import { setStateMoveItem } from "../../app/moveItemSlice";
import WindowTreeViewMoveTo from "../WindowTreeViewMoveTo/WindowTreeViewMoveTo";
import WindowTitleMoveTo from "../WindowTitleMoveTo/WindowTitleMoveTo";
import { Error } from "../../types/Error";


function WindowMoveTo() {
  const state = useSelector((state: { appState: StateApp, moveItemState: StateApp }) => ({
    dialogOpened: state.appState.dialogOpened,
    itemType: state.appState.itemType,
    selectedItem: state.appState.selectedItem,
    selectedItemFile: state.appState.selectedItemFile,
    selectedFolder: state.appState.selectedFolder,
    currentPathMoveItem: state.moveItemState.currentPath,
  }), shallowEqual);
  const dispatch = useDispatch();

  const {
    dialogOpened, 
    itemType,
    selectedItem,
    selectedItemFile,
    selectedFolder,
    currentPathMoveItem,
  } = state;

  const handleClose = () => {
    dispatch(setState({
      ...resetedValues,
    }));
    dispatch(setStateMoveItem({
      ...resetedValues,
    }));
  };

  const handleError = (error: Error) => {
    dispatch(setState({
      error,
      action: "",
    }));
    dispatch(setStateMoveItem({
      error,
      action: "",
    }));
  };

  const handleConfirm = () => {
    const itemName = getItemNameFromPath(itemType === "file" ? selectedItemFile : { path: selectedFolder})
    const api = itemType === "file" ? moveFile : moveFolder;
    api({
      oldPath: selectedItem?.path || selectedItemFile?.path,
      newPath:  `${currentPathMoveItem}/${itemName}`,
    }).then(() => {
      handleClose();
    }).catch((error) => {
      handleError(error)
    });
  };

  console.log('state', state);

  return (
    <Dialog
      open={dialogOpened}
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
            <WindowTitleMoveTo />
          </Grid>
          <Grid item xs={12}>
            <WindowTreeViewMoveTo />
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
