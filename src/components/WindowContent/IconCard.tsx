import { useState, JSX } from "react";
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
import ClearIcon from "@mui/icons-material/Clear";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { openFile } from "../../data/methods";
import { ACTIONS, COMPUTER } from "../../constants/constants";
import displayIcon from "../../utils/displayIcons";
import { IconCardProps } from "../../types/IconCardProps";
import { ContextMenuType } from "../../types/ContextMenuType";
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";
import { HandleContextMenuEvent } from "../../types/HandleContextMenuEvent";

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

  // getting state variables from react-redux store
  const state = useSelector((state: { appState: ReducerItems }) => ({
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

  // state var and function for context menu
  const [contextMenu, setContextMenu] = useState<ContextMenuType>(null);

  const contextMenuItems = [
    {
      name: "Open",
      action: ACTIONS.open,
    },
    {
      name: "Copy",
      action: ACTIONS.copy,
      icon: <ContentCopy fontSize="small" />
    },
    {
      name: "Move to",
      action: ACTIONS.moveTo,
      disabled: !(selectedItem || selectedItemFile),
      icon: <DriveFileMoveIcon sx={{ color: "#cc6600" }} />,
    },
    {
      name: "Delete",
      action: ACTIONS.delete,
      icon: <ClearIcon fontSize="small" />
    },
  ];

  function handleOpen() {
    if (!isFolder) {
      openFile({ path }).then((res) => {
        console.log(res);
      });
    } else {
      dispatch(setState({
        visitedPaths: [...visitedPaths!, path],
        currentPath: path,
        currentPosition: visitedPaths?.length || 0,
        selectedItem: { path },
        selectedFolder: path,
        doubleClick: 2,
        folderData: [],
      }));
    }
    setContextMenu(null);;
  };

  function handleClickContextMenu(action: string) {
    dispatch(setState({
      action,
    }));
    setContextMenu(null);
  };

  function displayContexMenuItems() {
    const menuItems = contextMenuItems.map((item) => {
      return (
        <MenuItem
          key={item.name}
          onClick={() => {item.action === 'open' ? handleOpen() :  handleClickContextMenu(item.action)}}
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

  const handleContextMenu = (event: HandleContextMenuEvent) => {
    event.preventDefault();
    if (contextMenu === null) {
      if (!isFolder) {
        dispatch(setState({
          selectedItemFile: { path },
          doubleClick: 1,
          itemType: "file",
        }));
      } else {
        dispatch(setState({
          selectedItem: { path },
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

  const selectionColorItem = (selectedItem?.path || selectedItemFile?.path) === itemId ? "#00134d" : "#ffffff";
  const fontColorItem = (selectedItem?.path || selectedItemFile?.path) === itemId ? "#ffffff" : "#000000";

  function handleOnClick() {
    if(!contextMenu && !(!permission && currentPath !== COMPUTER) && onClick) {
      onClick();
    } else {
      () => {};
    }
  }

  return (
    <Grid
      id={itemId}
      item
      xs={2}
      key={itemId}
      sx={{
        margin: "10px",
        height: "fit-content",
        cursor: "pointer",
        visibility: !name ? "hidden" : "visible",
      }}
      onClick={() => handleOnClick()}
      onMouseLeave={onMouseLeave}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: selectionColorItem,
          color: fontColorItem,
          border: "0px",
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
              WebkitUserSelect: "none", /* Safari */
              userSelect: "none",
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
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
          }
        >
          {displayContexMenuItems()}
        </Menu>
      </Paper>
    </Grid>
  );
}

export default IconCard;
