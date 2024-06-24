import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

import { copyFile, copyFolder } from "../../data/methods";
import { resetedValues, ACTIONS, COMPUTER } from "../../constants/constants";
import getItemNameFromPath from "../../utils/getItemNameFromPath";
import DeleteDialog from "../Dialogs/DeleteDialog";
import ErrorDialog from "../Dialogs/ErrorDialog";
import CreateFolderDialog from "../Dialogs/CreateFolderDialog";
import WindowMoveTo from "./WindowMoveTo";

function WindowToolbar(props) {
  const { setState, state } = props;
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
  } = state;

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState();
  const [openMoveToDialog, setOpenMoveToDialog] = useState();

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
        ...state,
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
        ...state,
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
        ...state,
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
        ...state,
        action: ACTIONS.copy,
      },
      disabled: !(selectedItem || selectedItemFile),
      icon: <ContentCopyIcon />,
    },
    {
      name: "paste",
      stateVar: {
        ...state,
        action: ACTIONS.paste,
      },
      disabled: action !== 'copy',
      icon: <ContentPasteIcon sx={{ color: "#993333" }} />,
    },
    {
      name: "delete",
      mestateVarthod: {
        ...state,
        action: ACTIONS.delete,
      },
      disabled: !(selectedItem || selectedItemFile),
      icon: <ClearIcon sx={{ color: "#ff3300" }} />,
    },
    {
      name: "create folder",
      stateVar: {
        ...state,
        action: ACTIONS.createFolder,
      },
      icon: <CreateNewFolderIcon sx={{ color: "#cc6600" }} />,
    },
    {
      name: "Move to",
      stateVar: {
        ...state,
        action: ACTIONS.moveTo,
      },
      disabled: !(selectedItem || selectedItemFile),
      icon: <DriveFileMoveIcon sx={{ color: "#cc6600" }} />,
    },
  ];

  const displayButtons = () => {
    const btnToDisplay = btns.map((button) => {
      return (
        <Button
          key={button.name}
          variant="outlined"
          startIcon={button.icon}
          onClick={() => setState(button.stateVar)}
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
      const itemName = getItemNameFromPath(state.itemType === "file" ? state.selectedItemFile : {path: state.selectedFolder})
      const api = state.itemType ? copyFile : copyFolder;

      api({
        oldPath: state.itemType === "file" ? selectedItemFile?.path : selectedFolder,
        newPath: `${state.currentPath}/${itemName}`,
      })
        .then(() => {
            setState({
              ...state,
              ...resetedValues,
            });
        })
        .catch((error) => {
          setState({
            ...state,
            error,
            action: "",
          });
        });
    }
    if (action === ACTIONS.delete) {
      setOpenDeleteDialog(true);
    }
    if (action === ACTIONS.createFolder) {
      setOpenCreateFolderDialog(true);
    }
    if (action === ACTIONS.moveTo) {
      setOpenMoveToDialog(true);
    }
  }, [
    setState,
    state,
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
          state={state}
          setState={setState}
        />
      )}
      {openCreateFolderDialog && (
        <CreateFolderDialog
          open={openCreateFolderDialog}
          setOpen={setOpenCreateFolderDialog}
          state={state}
          setState={setState}
        />
      )}
      {error?.code.length > 0 && (
        <ErrorDialog
          open={error?.code.length > 0}
          state={state}
          setState={setState}
        />
      )}
      {openMoveToDialog && (
        <WindowMoveTo
          open={openMoveToDialog}
          setOpen={setOpenMoveToDialog}
          state={state}
          setState={setState}
        />
      )}
      {displayButtons()}
    </Box>
  );
}

export default WindowToolbar;

WindowToolbar.propTypes = {
  state: PropTypes.shape({
    currentPath: PropTypes.string,
    currentPosition: PropTypes.number,
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
    selectedItem: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedItemFile: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedFolder: PropTypes.string,
    itemType: PropTypes.string,
    action: PropTypes.string,
    error: PropTypes.shape({
      code: PropTypes.string,
    }),
  }).isRequired,
  setState: PropTypes.func.isRequired,
};
