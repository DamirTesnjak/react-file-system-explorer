import React, { useState, JSX } from "react";
import {
  Grid,
  Paper,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import displayIcon from "../../utils/displayIcons";
import { IconCardProps } from "../../types/IconCardProps";
import { ContextMenuType } from "../../types/ContextMenuType";
import { setState } from "../../app/appSlice";
import { StateApp } from "../../types/StateApp";

function IconCard(props: IconCardProps): JSX.Element {
  const {
    isFolder,
    isFile,
    isDisk,
    name,
    itemId,
    onClick,
    onMouseLeave,
    path,
    permission,
  } = props;

  const state = useSelector((state: { appState: StateApp }) => ({
    visitedPaths: state.appState.visitedPaths,
    selectedItem: state.appState.selectedItem,
    selectedItemFile: state.appState.selectedItemFile,
    currentPath: state.appState.currentPath,
  }), shallowEqual);
  const dispatch = useDispatch();

  const {
    visitedPaths,
    selectedItem,
    selectedItemFile,
    currentPath,
  } = state;

  const [contextMenu, setContextMenu] = useState<ContextMenuType>(null);

  const contextMenuItems = [
    {
      name: "Open",
      method: handleOpen,
    },
    {
      name: "Copy",
      method: handleCopy,
      icon: <ContentCopy fontSize="small" />
    },
    {
      name: "Paste",
      method: handlePaste,
      icon: <ContentPasteIcon fontSize="small" />
    },
    {
      name: "Delete",
      method: handleDelete,
      icon: <ClearIcon fontSize="small" />
    },
  ];

  function displayContexMenuItems() {
    const menuItems = contextMenuItems.map((item) => {
      return (
        <MenuItem
          key={item.name}
          onClick={item.method}
        >
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText>{item.name}</ListItemText>
        </MenuItem>
      );
    });
    return menuItems;
  }

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (event: { preventDefault: () => void; clientX: number; clientY: number; }) => {
    event.preventDefault();
    if (contextMenu === null) {
      if (!isFolder) {
        dispatch(setState({
          selectedItemFile: {
            path: path,
          },
          doubleClick: 1,
          itemType: "file",
        }));
      } else {
        dispatch(setState({
          selectedItem: {
            path: path,
          },
          selectedFolder: path,
          doubleClick: 1,
        }));
      }
    }
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        null
    );
  };

  function handleOpen() {
    if (!isFolder) {
      openFile({ path: path }).then((res) => {
        console.log(res);
      });
    } else {
      dispatch(setState({
        visitedPaths: [...visitedPaths!, path],
        currentPath: path,
        currentPosition: visitedPaths?.length || 0,
        selectedItem: {
          path: path,
        },
        selectedFolder: path,
        doubleClick: 2,
        folderData: [],
        numOfItemsFolder: 1,
      }));
    }
    handleClose();
  };

  function handleCopy() {
    dispatch(setState({
      action: "copy",
    }));
    handleClose();
  };

  function handlePaste() {
    dispatch(setState({
      action: "paste",
    }));
    handleClose();
  };

  function handleDelete() {
    dispatch(setState({
      action: "delete",
    }));
    handleClose();
  };

  return (
    <Grid
      id={itemId}
      item
      xs={2}
      key={itemId}
      sx={{
        margin: "10px",
        cursor: "pointer",
        visibility: !name ? "hidden" : "visible",
      }}
      onClick={!contextMenu && !(!permission && currentPath !== COMPUTER) ? onClick : ()=> {}}
      onMouseLeave={onMouseLeave}
    >
      <Paper
        elevation={2}
        sx={{
          backgroundColor:
            (selectedItem?.path || selectedItemFile?.path) === itemId
              ? "#00134d"
              : "#ffffff",
          color:
            (selectedItem?.path || selectedItemFile?.path) === itemId
              ? "#ffffff"
              : "#000000",
        }}
        onContextMenu={handleContextMenu}
      >
        {displayIcon({
          permission,
          isFolder,
          isFile,
          isDisk,
          name,
          currentPath,
        })}
        <Typography
          variant="subtitle2"
          component="span"
          sx={{ display: "inline-block" }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              width: 150,
            }}
          >
            {name}
            <br />
            {!permission && currentPath !== COMPUTER ? "No access" : ""}
          </span>
        </Typography>
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX }: undefined
          }
        >
          {displayContexMenuItems()}
        </Menu>
      </Paper>
    </Grid>
  );
}

export default IconCard;
