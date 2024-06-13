import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import { copyFile, copyFolder } from "../../data/methods";
import DeleteDialog from "./DeleteDialog";
import ErrorDialog from './ErrorDialog';
import CreateFolderDialog from "./CreateFolderDialog";

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
    visitedPaths[
      currentPosition > 0 ? currentPosition - 1 : 0
    ];

  const btnNextCondition =
    currentPosition < visitedPaths.length - 1
      ? currentPosition + 1
      : visitedPaths.length - 1;

  const btns = [
    {
      name: "back",
      method: {
        ...state,
        visitedPaths: [...visitedPaths, btnBackCurrentPathCondition],
        currentPosition: btnBackCurrentPositionCondition,
        currentPath: btnBackCurrentPathCondition,
        folderData: [],
        numOfItemsFolder: 1,
      },
      icon: <ArrowBackIcon sx={{ color: "#66ffff" }}/>,
    },
    {
      name: "next",
      method: {
        ...state,
        currentPosition: btnNextCondition,
        currentPath: visitedPaths[btnNextCondition],
        folderData: [],
        numOfItemsFolder: 1,
      },
      icon: <ArrowForwardIcon sx={{ color: "#66ffff" }}/>,
    },
    {
      name: "up",
      method: {
        ...state,
        visitedPaths: [...visitedPaths, parentPath()],
        currentPath: parentPath(),
        currentPosition: visitedPaths.length,
        folderData: [],
        numOfItemsFolder: 1,
      },
      icon: <ArrowUpwardIcon sx={{ color: "#66ffff" }}/>,
    },
    {
      name: "copy",
      method: {
        ...state,
        action: "copy",
      },
      icon: <ContentCopyIcon/>,
    },
    {
      name: "paste",
      method: {
        ...state,
        action: "paste",
      },
      icon: <ContentPasteIcon sx={{ color: "#993333" }}/>,
    },
    {
      name: "delete",
      method: {
        ...state,
        action: "delete",
      },
      icon: <ClearIcon sx={{ color: "#ff3300" }}/>,
    },
    {
      name: "create folder",
      method: {
        ...state,
        action: "createFolder",
      },
      icon: <CreateNewFolderIcon sx={{ color: "#cc6600" }}/>,
    },
  ];

  const disableButton = (button) => {
    if ((selectedFolder || selectedItemFile) && (button.name === 'copy' || button.name === 'paste' || button.name === 'delete')) {
      return false
    }
    if (!(selectedFolder || selectedItemFile) && (button.name === 'copy' || button.name === 'paste' || button.name === 'delete')) {
      return true
    }
  }

  const displayButtons = () => {
    const btnToDisplay = btns.map((button) => {
      return (
        <Button
          key={button.name}
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
    if (action === "paste") {
      const selecedItemPathArr = state.itemType === 'file' ? selectedItemFile?.path.split("/") : selectedFolder?.split("/");
      const selectedItemFilename = selecedItemPathArr ? selecedItemPathArr[selecedItemPathArr.length - 1] : '';

      const api = state.itemType ? copyFile : copyFolder

      api({
        oldPath: state.itemType === 'file' ? selectedItemFile?.path : selectedFolder,
        newPath: `${state.currentPath}/${selectedItemFilename}`,
      }).then((res) => {
        if (!res.data.err) {
        setState({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          selectedFolder: null,
          action: '',
          itemType: null,
          folderData: [],
        })
      } else {
        setState({
          ...state,
          error: res.data.err,
          action: "",
        });
      }
        console.log("res", res);
      })
        .catch((e) => {
          console.log('err', e);
        });
    }
    if (action === "delete") {
      setOpenDeleteDialog(true);
    }
    if(action === "createFolder") {
      setOpenCreateFolderDialog(true)
    }
  }, [setState, state, action, currentPath, itemType, selectedItem, selectedItemFile]);

  return (
    <Box sx={{ backgroundColor: "#c0c7c8f2" }}>
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        state={state}
        setState={setState}
      />
      <CreateFolderDialog
        open={openCreateFolderDialog}
        setOpen={setOpenCreateFolderDialog}
        state={state}
        setState={setState}
      />
      <ErrorDialog
        open={error?.code.length > 0}
        state={state}
        setState={setState}
      />
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
}
