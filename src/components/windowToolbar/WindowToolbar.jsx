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
    setState,
  } = props;

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

  const handleOnClick = (button) => {
    setState((prevState) => ({
      ...prevState,
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
            setState((prevState) => ({
              ...prevState,
              ...resetedValues,
            }));
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
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
      setOpenMoveToDialog(true);
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
          itemType={itemType}
          selectedItem={selectedItem}
          selectedItemFile={selectedItemFile}
          setState={setState}
        />
      )}
      {openCreateFolderDialog && (
        <CreateFolderDialog
          open={openCreateFolderDialog}
          setOpen={setOpenCreateFolderDialog}
          currentPath={currentPath}
          setState={setState}
        />
      )}
      {error?.code?.length > 0 && (
        <ErrorDialog
          open={error?.code?.length > 0}
          error={error}
          setState={setState}
        />
      )}
      {openMoveToDialog && (
        <WindowMoveTo
          open={openMoveToDialog}
          setOpen={setOpenMoveToDialog}
          itemType={itemType}
          selectedItem={selectedItem}
          selectedItemFile={selectedItemFile}
          selectedFolder={selectedFolder}
          setState={setState}
        />
      )}
      {displayButtons()}
    </Box>
  );
}

export default WindowToolbar;

WindowToolbar.propTypes = {
  currentPath: PropTypes.string.isRequired,
  currentPosition: PropTypes.number.isRequired,
  visitedPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  selectedItemFile: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  selectedFolder: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  error: PropTypes.shape({
    code: PropTypes.string,
  }).isRequired,
  setState: PropTypes.func.isRequired,
};
