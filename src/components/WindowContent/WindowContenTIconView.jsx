import React, { useState, useEffect, useCallback } from "react";
import { Grid, IconButton, Box, Paper, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import Album from "@mui/icons-material/Album";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Icon } from "@fluentui/react/lib/Icon";

import { getFolder, openFile } from "../../data/methods";
import { getHardDrives } from "../../data/methods";

function IconCard(props) {
  const { state, type, name, itemId, onClick, onMouseLeave } = props;

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
      }}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    >
        <Paper
          elevation={2}
          sx={{
            backgroundColor:
            state.selectedItem?.path === itemId
                ? "#00134d"
                : "#ffffff",
            color:
            state.selectedItem?.path === itemId
                ? "#ffffff"
                : "#000000",
          }}
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
        selectedItem: null,
        doubleClick: 0,
        folderData: res.data.folderContent,
        numOfItemsFolder: res.data.numOfItemsFolder,
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
    if (
      state.folderData.length === 0 &&
      state.numOfItemsFolder > 0 &&
      state.currentPath !== "Computer"
    ) {
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
                doubleClick: 1
              });
            }
            if (state.doubleClick >= 1) {
                setState(newState);
              }
            };

            const onMouseLeave = () => {
              setState({
                ...state,
                doubleClick: 0
              })
            }

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
      return <h2>Folder does not have any elements!</h2>;
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
              doubleClick: 0
            })
          }

          const onClick = () => {
            if (state.doubleClick === 0) {
              setState({
                ...state,
                selectedItem: {
                  path: itemList.path,
                },
                doubleClick: 1
              });
            }
            if (state.doubleClick >= 1) {
              if (setType(itemList) === "file") {
                openSelectedFile(itemList.path);
              } else {
                console.log('test4444');
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
      return <h2>Folder does not have any elements!</h2>;
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#ffffff",
        height: "calc(100vh - 120px)",
        overflow: "scroll",
      }}
    >
      <Grid container>{displayItemsAsIcons()}</Grid>
    </Box>
  );
};

export default WindowContentIconView;
