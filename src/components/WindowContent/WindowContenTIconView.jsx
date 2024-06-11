import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  IconButton,
  Box,
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
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ClearIcon from '@mui/icons-material/Clear';

import { getFolder, openFile } from "../../data/methods";
import { getHardDrives } from "../../data/methods";

function IconCard(props) {
  const { state, type, name, itemId, onClick, onMouseLeave, setState, path } = props;

  const [contextMenu, setContextMenu] = React.useState(null);

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (contextMenu === null) {
      if (type === "file") {
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
    };
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
    if (type === "file") {
      openFile({ path: path }).then((res) => {
        console.log(res);
      });
    } else {
      setState({
        ...state,
        visitedPaths: [...state.visitedPaths, path],
        currentPath: path,
        currentPosition: state.visitedPaths.length,
        selectedItem: {
          path: path,
        },
        selectedFolder: path,
        doubleClick: 2,
        folderData: [],
        numOfItemsFolder: 1,
      });
    };
    handleClose();
  };

  const handleCopy = () => {
    setState( {
      ...state,
      action: "copy",
    });
    handleClose();
  }

  const handlePaste = () => {
    setState({
      ...state,
      action: "paste",
    });
    handleClose();
  }

  const handleDelete = () => {
    setState({
      ...state,
      action: "delete",
    });
    handleClose();
  }

  const displayIcon = () => {
    if (type === "folder") {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <FolderIcon sx={{ fontSize: 64, color: "orange" }} />
        </IconButton>
      );
    }
    if (type === "file") {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <Icon
            {...getFileTypeIconProps({
              extension: name.split(".")[1],
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
        visibility: name === "" ? "hidden" : "visible",
      }}
      onClick={!contextMenu ? onClick : null}
      onMouseLeave={onMouseLeave}
    >
      <Paper
        elevation={2}
        sx={{
          backgroundColor:
            state.selectedItem?.path === itemId ||
            state.selectedItemFile?.path === itemId
              ? "#00134d"
              : "#ffffff",
          color:
            state.selectedItem?.path === itemId ||
            state.selectedItemFile?.path === itemId
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

const WindowContentIconView = (props) => {
  const { state, setState } = props;

  const [disksData, setFdisksDatata] = useState([]);

  const getFolderContentCallBack = useCallback(() => {
    getFolder({ folderPath: state.currentPath }).then((res) => {
      setState({
        ...state,
        selectedItem: state.action === "copy" ? state.selectedItem : null,
        selectedItemFile:
          state.action === "copy" ? state.selectedItemFile : null,
        doubleClick: 0,
        folderData:
          res.data.folderContent.length === 0
            ? [
                {
                  name: "",
                },
              ]
            : res.data.folderContent,
        numOfItemsFolder: 1,
      });
    });
  }, [setState, state]);

  const getHardDrivesFolderContent = () => {
    getHardDrives().then((res) => {
      setFdisksDatata(res.data.hardDrives);
    });
  };

  useEffect(() => {
    if (disksData.length === 0 && state.currentPath === "Computer") {
      getHardDrivesFolderContent();
    }
  }, [disksData.length, state.currentPath]);

  useEffect(() => {
    if (state.folderData.length === 0 && state.currentPath !== "Computer") {
      getFolderContentCallBack();
    }
  }, [
    getFolderContentCallBack,
    state.currentPath,
    state.folderData.length,
    state.numOfItemsFolder,
  ]);

  useEffect(() => {
    if (
      state.selectedItem &&
      state.doubleClick === 2 &&
      state.currentPath !== "Computer"
    ) {
      getFolderContentCallBack();
    }
  }, [
    getFolderContentCallBack,
    state.currentPath,
    state.doubleClick,
    state.folderData,
    state.numOfItemsFolder,
    state.selectedItem,
  ]);

  const openSelectedFile = (path) => {
    openFile({ path: path }).then((res) => {
      console.log(res);
    });
  };

  const displayItemsAsIcons = () => {
    if (state.currentPath === "Computer") {
      if (disksData && disksData.length > 0) {
        const items = disksData.map((diskItem) => {
          const newState = {
            ...state,
            visitedPaths: [...state.visitedPaths, diskItem.mounted + "/"],
            currentPath: diskItem.mounted + "/",
            currentPosition: state.visitedPaths.length,
            folderData: [],
            numOfItemsFolder: 1,
          };

          const onClick = () => {
            if (state.doubleClick === 0) {
              setState({
                ...state,
                selectedItem: {
                  path: diskItem.mounted + "/",
                },
                doubleClick: 1,
              });
            }
            if (state.doubleClick >= 1) {
              setState(newState);
            }
          };

          const onMouseLeave = () => {
            setState({
              ...state,
              doubleClick: 0,
            });
          };

          return (
            <IconCard
              state={state}
              type="hardDrive"
              itemId={diskItem.mounted + "/"}
              name={diskItem.filesystem + " " + diskItem.mounted}
              path={diskItem.mounted + "/"}
              onClick={() => onClick()}
              onMouseLeave={onMouseLeave}
              setState={setState}
            />
          );
        });
        return items;
      }
      return <h2>Please wait...</h2>;
    } else {
      if (state.folderData && state.folderData.length > 0) {
        const setType = (itemList) => {
          if (itemList.name.includes("$")) {
            return "folder";
          }
          if (itemList.name.includes(".")) {
            return "file";
          }
          return "folder";
        };
        const items = state.folderData.map((itemList) => {
          const newState = {
            ...state,
            visitedPaths: [...state.visitedPaths, itemList.path],
            currentPath: itemList.path,
            currentPosition: state.visitedPaths.length,
            doubleClick: 2,
            folderData: [],
            numOfItemsFolder: 1,
          };

          const onMouseLeave = () => {
            setState({
              ...state,
              doubleClick: 0,
            });
          };

          const onClick = () => {
            if (state.doubleClick === 0) {
              if (setType(itemList) === "file") {
                setState({
                  ...state,
                  selectedItemFile: {
                    path: itemList.path,
                  },
                  selectedFolder: null,
                  doubleClick: 1,
                  itemType: "file",
                });
              } else {
                if (!state.selectedFolder) {
                  setState({
                    ...state,
                    selectedItem: {
                      path: itemList.path,
                    },
                    selectedFolder: itemList.path,
                    doubleClick: 1,
                  });
                } else {
                  setState({
                    ...state,
                    selectedItem: {
                      path: itemList.path,
                    },
                    doubleClick: 1,
                  });
                }
              }
            }
            if (state.doubleClick >= 1) {
              if (setType(itemList) === "file") {
                openSelectedFile(itemList.path);
              } else {
                setState(newState);
              }
            }
          };

          return (
            <IconCard
              state={state}
              type={setType(itemList)}
              itemId={itemList.path}
              name={itemList.name}
              path={itemList.path}
              itemCount={itemList.itemCount}
              onClick={() => onClick()}
              onMouseLeave={onMouseLeave}
              setState={setState}
            />
          );
        });
        return items;
      }
      return <h2>Please wait...</h2>;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #020102",
        borderLeft: "2px solid #020102",
        borderBottom: "2px solid #808080",
        borderRight: "2px solid #808080",
        height: "calc(100vh - 161px)",
        overflow: "scroll",
      }}
    >
      <Grid container>{displayItemsAsIcons()}</Grid>
    </Box>
  );
};

export default WindowContentIconView;
