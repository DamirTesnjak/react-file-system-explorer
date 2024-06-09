import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material//ArrowForward";
import ArrowBackIcon from "@mui/icons-material//ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material//ArrowUpward";

import { copyFile, copyFolder } from "../../data/methods";
import DeleteDialog from "./DeleteDialog";

function WindowToolbar(props) {
  const { currentPath, setState, state } = props;

  const [openDeleteDialog, setOpenDeleteDialog] = useState();

  const parentPath = () => {
    const currentPathArray = currentPath?.split("/");
    currentPathArray?.splice(currentPathArray.length - 1, 1);

    const parentPath = currentPathArray?.join("/");
    if (parentPath) {
      return parentPath;
    }
  };

  const btnBackCurrentPositionCondition =
    state.currentPosition > 0 ? state.currentPosition - 1 : 0;
  const btnBackCurrentPathCondition =
    state.visitedPaths[
      state.currentPosition > 0 ? state.currentPosition - 1 : 0
    ];

  const btnNextCondition =
    state.currentPosition < state.visitedPaths.length - 1
      ? state.currentPosition + 1
      : state.visitedPaths.length - 1;

  const btns = [
    {
      name: "back",
      method: {
        ...state,
        visitedPaths: [...state.visitedPaths, btnBackCurrentPathCondition],
        currentPosition: btnBackCurrentPositionCondition,
        currentPath: btnBackCurrentPathCondition,
        folderData: [],
        numOfItemsFolder: 1,
      },
      icon: <ArrowBackIcon />,
    },
    {
      name: "next",
      method: {
        ...state,
        currentPosition: btnNextCondition,
        currentPath: state.visitedPaths[btnNextCondition],
        folderData: [],
        numOfItemsFolder: 1,
      },
      icon: <ArrowForwardIcon />,
    },
    {
      name: "up",
      method: {
        ...state,
        visitedPaths: [...state.visitedPaths, parentPath()],
        currentPath: parentPath(),
        currentPosition: state.visitedPaths.length,
        folderData: [],
        numOfItemsFolder: 1,
      },
      icon: <ArrowUpwardIcon />,
    },
    {
      name: "copy",
      method: {
        ...state,
        action: "copy",
      },
      icon: <ArrowUpwardIcon />,
    },
    {
      name: "paste",
      method: {
        ...state,
        action: "paste",
      },
      icon: <ArrowUpwardIcon />,
    },
    {
      name: "delete",
      method: {
        ...state,
        action: "delete",
      },
      icon: <ArrowUpwardIcon />,
    },
  ];

  const disableButton = (button) => {
    if ((state.selectedFolder || state.selectedItemFile) && (button.name === 'copy' || button.name === 'paste' || button.name === 'delete')) {
      return false
    }
    if (!(state.selectedFolder || state.selectedItemFile) && (button.name === 'copy' || button.name === 'paste' || button.name === 'delete')) {
      return true
    }
  }

  const displayButtons = () => {
    const btnToDisplay = btns.map((button) => {
      return (
        <Button
          variant="outlined"
          startIcon={button.icon}
          onClick={() => setState(button.method)}
          disabled={disableButton(button)}
        >
          {button.name}
        </Button>
      );
    });
    return btnToDisplay;
  };

  useEffect(() => {
    if (state.action === "paste") {
      const selecedItemPathArr = state.itemType === 'file' ? state.selectedItemFile?.path.split("/") : state.selectedFolder?.split("/");
      const selectedItemFilename = selecedItemPathArr ? selecedItemPathArr[selecedItemPathArr.length - 1] : '';

      const api = state.itemType ? copyFile : copyFolder

      api({
        oldPath: state.itemType === 'file' ? state.selectedItemFile?.path : state.selectedFolder,
        newPath: `${state.currentPath}/${selectedItemFilename}`,
      }).then((res) => {
        setState({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          selectedFolder: null,
          action: '',
          itemType: null,
          folderData: [],
        })
        console.log("res", res);
      });
    }
    if (state.action === "delete") {
      setOpenDeleteDialog(true);
    }
  }, [setState, state, state.action, state.currentPath, state.itemType, state.selectedItem, state.selectedItemFile]);

  return (
    <Box sx={{ backgroundColor: "#f2f2f2" }}>
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        state={state}
        setState={setState}
      />
      {displayButtons()}
    </Box>
  );
}

export default WindowToolbar;
