import React from "react";
import PropTypes from "prop-types";
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

import { openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import displayIcon from "../../utils/displayIcons";

function IconCard(props) {
  const {
    isFolder,
    isFile,
    isDisk,
    name,
    itemId,
    onClick,
    onMouseLeave,
    setState,
    path,
    permission,
    visitedPaths,
    selectedItem,
    selectedItemFile,
    currentPath,
  } = props;

  const [contextMenu, setContextMenu] = React.useState(null);

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

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (contextMenu === null) {
      if (!isFolder) {
        setState((prevState) => ({
          ...prevState,
          selectedItemFile: {
            path: path,
          },
          doubleClick: 1,
          itemType: "file",
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
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
      setState((prevState) => ({
        ...prevState,
        visitedPaths: [...visitedPaths, path],
        currentPath: path,
        currentPosition: visitedPaths.length,
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
    setState((prevState) => ({
      ...prevState,
      action: "copy",
    }));
    handleClose();
  };

  function handlePaste() {
    setState((prevState) => ({
      ...prevState,
      action: "paste",
    }));
    handleClose();
  };

  function handleDelete() {
    setState((prevState) => ({
      ...prevState,
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
      onClick={!contextMenu && !(!permission && currentPath !== COMPUTER) ? onClick : null}
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
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          {displayContexMenuItems()}
        </Menu>
      </Paper>
    </Grid>
  );
}

export default IconCard;

IconCard.propTypes = {
  currentPath: PropTypes.string.isRequired,
  visitedPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  selectedItemFile: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  isFolder: PropTypes.bool.isRequired,
  isDisk: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  permission: PropTypes.bool.isRequired,
  isFile: PropTypes.bool.isRequired,
};
