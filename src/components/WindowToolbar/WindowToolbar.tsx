import React, { useEffect, useState, JSX } from "react";
import { Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { copyFile, copyFolder } from "../../data/methods";
import { resetedValues, ACTIONS, COMPUTER } from "../../constants/constants";
import getItemNameFromPath from "../../utils/getItemNameFromPath";
import DeleteDialog from "../Dialogs/DeleteDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import CreateFolderDialog from "../Dialogs/CreateFolderDialog";
import WindowMoveTo from "./WindowMoveTo";
import { setState } from "../../app/appSlice";
import { StateApp } from "../../types/StateApp";

function WindowToolbar() {
const state = useSelector((state: { appState: StateApp }) => ({
  dialogOpened: state.appState.dialogOpened,
  currentPath: state.appState.currentPath,
  currentPosition: state.appState.currentPosition,
  visitedPaths: state.appState.visitedPaths,
  action: state.appState.action,
  error: state.appState.error,
  itemType: state.appState.itemType,
  selectedItem: state.appState.selectedItem,
  selectedItemFile: state.appState.selectedItemFile,
  selectedFolder: state.appState.selectedFolder,
  }), shallowEqual);
  const dispatch = useDispatch();
  const {
    currentPath,
    currentPosition,
    visitedPaths,
    action,
    error,
    itemType,
    selectedItem,
    selectedItemFile,
    selectedFolder,
    dialogOpened, 
  } = state;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);

  const parentPath = () => {
    const currentPathArray = currentPath?.split("/");
    currentPathArray?.splice(currentPathArray.length - 1, 1);

    const parentPath = currentPathArray?.join("/");
    if (parentPath) {
      return parentPath;
    }
  };

  const btnBackCurrentPositionCondition =
    currentPosition > 0 ? currentPosition - 1 : 0;
  const btnBackCurrentPathCondition =
    visitedPaths[currentPosition > 0 ? currentPosition - 1 : 0];

  const btnNextCondition =
    currentPosition < visitedPaths.length - 1
      ? currentPosition + 1
      : visitedPaths.length - 1;

  const btns = [
    {
      name: "back",
      stateVar: {
        visitedPaths: [...visitedPaths, btnBackCurrentPathCondition],
        currentPosition: btnBackCurrentPositionCondition,
        currentPath: btnBackCurrentPathCondition,
        folderData: [],
        numOfItemsFolder: 1,
      },
      disabled: currentPosition === 0,
      icon: <ArrowBackIcon sx={{ color: "#66ffff" }} />,
    },
    {
      name: "next",
      stateVar: {
        currentPosition: btnNextCondition,
        currentPath: visitedPaths[btnNextCondition],
        folderData: [],
        numOfItemsFolder: 1,
      },
      disabled: currentPosition === visitedPaths.length - 1,
      icon: <ArrowForwardIcon sx={{ color: "#66ffff" }} />,
    },
    {
      name: "up",
      stateVar: {
        visitedPaths: [...visitedPaths, parentPath()],
        currentPath: parentPath(),
        currentPosition: visitedPaths.length,
        folderData: [],
        numOfItemsFolder: 1,
      },
      disabled: visitedPaths.length === 0 && currentPath !== COMPUTER,
      icon: <ArrowUpwardIcon sx={{ color: "#66ffff" }} />,
    },
    {
      name: "copy",
      stateVar: {
        action: ACTIONS.copy,
      },
      disabled: !(selectedItem || selectedItemFile),
      icon: <ContentCopyIcon />,
    },
    {
      name: "paste",
      stateVar: {
        action: ACTIONS.paste,
      },
      disabled: action !== 'copy',
      icon: <ContentPasteIcon sx={{ color: "#993333" }} />,
    },
    {
      name: "delete",
      stateVar: {
        action: ACTIONS.delete,
      },
      disabled: !(selectedItem || selectedItemFile),
      icon: <ClearIcon sx={{ color: "#ff3300" }} />,
    },
    {
      name: "create folder",
      stateVar: {
        action: ACTIONS.createFolder,
      },
      icon: <CreateNewFolderIcon sx={{ color: "#cc6600" }} />,
    },
    {
      name: "Move to",
      stateVar: {
        action: ACTIONS.moveTo,
      },
      disabled: !(selectedItem || selectedItemFile),
      icon: <DriveFileMoveIcon sx={{ color: "#cc6600" }} />,
    },
  ];

  const handleOnClick = (button: any) => {
    dispatch(setState({
      ...button.stateVar,
    }))
  }

  const displayButtons = () => {
    const btnToDisplay = btns.map((button) => {
      return (
        <Button
          key={button.name}
          variant="outlined"
          startIcon={button.icon}
          onClick={() => handleOnClick(button)}
          disabled={button.disabled}
        >
          {button.name}
        </Button>
      );
    });
    return btnToDisplay;
  };

  useEffect(() => {
    if (action === ACTIONS.paste) {
      const itemName = getItemNameFromPath(itemType === "file" ? selectedItemFile : {path: selectedFolder})
      const api = itemType ? copyFile : copyFolder;

      api({
        oldPath: itemType === "file" ? selectedItemFile?.path : selectedFolder,
        newPath: `${currentPath}/${itemName}`,
      })
        .then(() => {
          dispatch(setState({
              ...resetedValues,
            }));
        })
        .catch((error) => {
          dispatch(setState({
            error,
            action: "",
          }));
        });
    }
    if (action === ACTIONS.delete) {
      setOpenDeleteDialog(true);
    }
    if (action === ACTIONS.createFolder) {
      setOpenCreateFolderDialog(true);
    }
    if (action === ACTIONS.moveTo) {
      dispatch(setState({
        dialogOpened: true,
      }));
    }
  }, [
    setState,
    action,
    currentPath,
    itemType,
    selectedItem,
    selectedItemFile,
  ]);

  return (
    <Box sx={{ backgroundColor: "#c0c7c8f2" }}>
      {openDeleteDialog && (
        <DeleteDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
        />
      )}
      {openCreateFolderDialog && (
        <CreateFolderDialog
          open={openCreateFolderDialog}
          setOpen={setOpenCreateFolderDialog}
        />
      )}
      {error && error.code?.length > 0 && (
        <ErrorDialog
          open={error?.code?.length > 0}
        />
      )}
      {dialogOpened && (
        <WindowMoveTo />
      )}
      {displayButtons()}
    </Box>
  );
}

export default WindowToolbar;
