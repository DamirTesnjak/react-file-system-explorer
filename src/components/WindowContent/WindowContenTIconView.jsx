import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, Box } from "@mui/material";

import IconCard from "./IconCard";
import { getFolder, openFile } from "../../data/methods";
import { getHardDrives } from "../../data/methods";

const WindowContentIconView = (props) => {
  const { state, setState } = props;
  const {
    currentPath,
    selectedItem,
    selectedItemFile,
    action,
    folderData,
    doubleClick,
    visitedPaths,
    selectedFolder,
  } = state;

  const [disksData, setFdisksDatata] = useState([]);

  const getFolderContentCallBack = useCallback(() => {
    getFolder({ folderPath: currentPath }).then((res) => {
      setState({
        ...state,
        selectedItem: action === "copy" ? selectedItem : null,
        selectedItemFile: action === "copy" ? selectedItemFile : null,
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
    if (disksData.length === 0 && currentPath === "Computer") {
      getHardDrivesFolderContent();
    }
  }, [disksData.length, currentPath]);

  useEffect(() => {
    if (folderData.length === 0 && currentPath !== "Computer") {
      getFolderContentCallBack();
    }
  }, [getFolderContentCallBack, currentPath, folderData.length]);

  useEffect(() => {
    if (selectedItem && doubleClick === 2 && currentPath !== "Computer") {
      getFolderContentCallBack();
    }
  }, [
    getFolderContentCallBack,
    currentPath,
    doubleClick,
    folderData,
    selectedItem,
  ]);

  const openSelectedFile = (path) => {
    openFile({ path: path }).then((res) => {
      console.log(res);
    });
  };

  const displayItemsAsIcons = () => {
    if (currentPath === "Computer") {
      if (disksData && disksData.length > 0) {
        const items = disksData.map((diskItem) => {
          const newState = {
            ...state,
            visitedPaths: [...visitedPaths, diskItem.mounted + "/"],
            currentPath: diskItem.mounted + "/",
            currentPosition: visitedPaths.length,
            folderData: [],
            numOfItemsFolder: 1,
          };

          const onClick = () => {
            if (doubleClick === 0) {
              setState({
                ...state,
                selectedItem: {
                  path: diskItem.mounted + "/",
                },
                doubleClick: 1,
              });
            }
            if (doubleClick >= 1) {
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
              key={diskItem.mounted + "/"}
              state={state}
              isDisk
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
      if (folderData && folderData.length > 0) {
        const setType = (itemList) => {
          if (itemList.name.includes("$")) {
            return "folder";
          }
          if (itemList.name.includes(".")) {
            return "file";
          }
          return "folder";
        };
        const items = folderData.map((itemList) => {
          const newState = {
            ...state,
            visitedPaths: [...visitedPaths, itemList.path],
            currentPath: itemList.path,
            currentPosition: visitedPaths.length,
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
            if (doubleClick === 0) {
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
                if (!selectedFolder) {
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
            if (doubleClick >= 1) {
              if (setType(itemList) === "file") {
                openSelectedFile(itemList.path);
              } else {
                setState(newState);
              }
            }
          };

          return (
            <IconCard
              key={itemList.path}
              state={state}
              isFolder={itemList.isFolder}
              isDisk={false}
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
        height: "calc(100vh - 127px)",
        overflow: "scroll",
      }}
    >
      <Grid container>{displayItemsAsIcons()}</Grid>
    </Box>
  );
};

export default WindowContentIconView;

WindowContentIconView.propTypes = {
  state: PropTypes.shape({
    currentPath: PropTypes.string.isRequired,
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
    selectedItem: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedItemFile: PropTypes.string,
    selectedFolder: PropTypes.string,
    doubleClick: PropTypes.number.isRequired,
    folderData: PropTypes.arrayOf(PropTypes.objectOf({
      type: PropTypes.string,
      name: PropTypes.string,
      parentPath: PropTypes.string,
      path: PropTypes.string,
      size: PropTypes.string,
      itemCounts: PropTypes.string,
      permission: PropTypes.bool,
      filesystem: PropTypes.string,
      blocks: PropTypes.number,
      used: PropTypes.number,
      available: PropTypes.number,
      capacity: PropTypes.number,
      mounted: PropTypes.number,
    })),
    action: PropTypes.string.isRequired,
  }),
  setState: PropTypes.func.isRequired,
};
