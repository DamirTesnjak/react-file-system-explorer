import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  Paper,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import Album from "@mui/icons-material/Album";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Icon } from "@fluentui/react/lib/Icon";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearIcon from "@mui/icons-material/Clear";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import { openFile } from "../../data/methods";

function IconCard(props) {
  const {
    state,
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
  } = props;
  const { visitedPaths, selectedItem, selectedItemFile } = state;

  const [contextMenu, setContextMenu] = React.useState(null);

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (contextMenu === null) {
      if (!isFolder) {
        setState({
          ...state,
          selectedItemFile: {
            path: path,
          },
          doubleClick: 1,
          itemType: "file",
        });
      } else {
        setState({
          ...state,
          selectedItem: {
            path: path,
          },
          selectedFolder: path,
          doubleClick: 1,
        });
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

  const handleOpen = () => {
    if (!isFolder) {
      openFile({ path: path }).then((res) => {
        console.log(res);
      });
    } else {
      setState({
        ...state,
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
      });
    }
    handleClose();
  };

  const handleCopy = () => {
    setState({
      ...state,
      action: "copy",
    });
    handleClose();
  };

  const handlePaste = () => {
    setState({
      ...state,
      action: "paste",
    });
    handleClose();
  };

  const handleDelete = () => {
    setState({
      ...state,
      action: "delete",
    });
    handleClose();
  };

  const displayIcon = () => {
    if (!permission && state.currentPath !== 'Computer') {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <QuestionMarkIcon sx={{ fontSize: 64, color: "red" }} />
        </IconButton>
      );
    }
    if (isFile && !isDisk) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <Icon
            {...getFileTypeIconProps({
              extension: name?.split(".")[1],
              size: 64,
            })}
          />
        </IconButton>
      );
    }
    if (isFolder && !isDisk) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <FolderIcon sx={{ fontSize: 64, color: "orange" }} />
        </IconButton>
      );
    }
    if (!isFolder && !isDisk) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <Icon
            {...getFileTypeIconProps({
              extension: name?.split(".")[1],
              size: 64,
            })}
          />
        </IconButton>
      );
    }
    return (
      <IconButton color="highlight" disableRipple>
        {name.includes("CD-ROM") ? (
          <Album sx={{ fontSize: 64, color: "grey" }} />
        ) : (
          <StorageOutlinedIcon sx={{ fontSize: 64, color: "grey" }} />
        )}
      </IconButton>
    );
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
      onClick={!contextMenu && !(!permission && state.currentPath !== 'Computer') ? onClick : null}
      onMouseLeave={onMouseLeave}
    >
      <Paper
        elevation={2}
        sx={{
          backgroundColor:
            selectedItem?.path === itemId || selectedItemFile?.path === itemId
              ? "#00134d"
              : "#ffffff",
          color:
            selectedItem?.path === itemId || selectedItemFile?.path === itemId
              ? "#ffffff"
              : "#000000",
        }}
        onContextMenu={handleContextMenu}
      >
        {displayIcon()}
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
          <MenuItem onClick={handleOpen}>Open</MenuItem>
          <MenuItem onClick={handleCopy}>
            <ListItemIcon>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy</ListItemText>
          </MenuItem>
          <MenuItem onClick={handlePaste}>
            <ListItemIcon>
              <ContentPasteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Paste</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <ClearIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </Grid>
  );
}

export default IconCard;

IconCard.propTypes = {
  state: PropTypes.shape({
    currentPath: PropTypes.string.isRequired,
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
    selectedItem: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedItemFile: PropTypes.shape({
      path: PropTypes.string,
    }),
  }),
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
