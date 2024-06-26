import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, Box } from "@mui/material";

import IconCard from "./IconCard";
import { openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import { getFolder, getHardDrives, } from "../../data/methods";

const WindowContentIconView = (props) => {
  const {
    currentPath,
    folderData,
    disksData,
    doubleClick,
    visitedPaths,
    selectedFolder,
    selectedItem,
    selectedItemFile,
    action,
    setState,
  } = props;

  const openSelectedFile = (path) => {
    openFile({ path: path }).then((res) => {
      console.log(res);
    });
  };

  const onMouseLeave = () => {
    setState((prevState) => ({
      ...prevState,
      doubleClick: 0,
    }));
  };

  const displayItemsAsIcons = () => {
    if (currentPath === COMPUTER) {
      if (disksData && disksData.length > 0) {
        const items = disksData.map((diskItem) => {
          const newState = {
            visitedPaths: [...visitedPaths, diskItem.mounted + "/"],
            currentPath: diskItem.mounted + "/",
            currentPosition: visitedPaths.length,
            folderData: [],
            numOfItemsFolder: 1,
          };

          const onClick = () => {
            if (doubleClick === 0) {
              setState((prevState) => ({
                ...prevState,
                selectedItem: {
                  path: diskItem.mounted + "/",
                },
                doubleClick: 1,
              }));
            }
            if (doubleClick >= 1) {
              setState((prevState) => ({
                ...prevState,
                ...newState,
              }));
            }
          };

          return (
            <IconCard
              key={diskItem.mounted + "/"}
              isDisk
              itemId={diskItem.mounted + "/"}
              name={diskItem.filesystem + " " + diskItem.mounted}
              path={diskItem.mounted + "/"}
              onClick={() => onClick()}
              onMouseLeave={onMouseLeave}
              setState={setState}
              permission={diskItem.permission}
            />
          );
        });
        return items;
      }
      return <h2>Please wait...</h2>;
    } else {
      if (folderData && folderData.length > 0) {
        const items = folderData.map((itemList) => {
          const newState = {
            visitedPaths: [...visitedPaths, itemList.path],
            currentPath: itemList.path,
            currentPosition: visitedPaths.length,
            doubleClick: 2,
            folderData: [],
            numOfItemsFolder: 1,
          };

          const onClick = () => {
            if (doubleClick === 0) {
              if (itemList.isFile) {
                setState((prevState) => {console.log('prevState', prevState); return ({
                  ...prevState,
                  selectedItemFile: {
                    path: itemList.path,
                  },
                  selectedFolder: null,
                  doubleClick: 1,
                  itemId: itemList.path,
                  itemType: "file",
                })});
              }
              if (itemList.isFolder) {
                setState((prevState) => {console.log('prevState', prevState); return ({
                  ...prevState,
                  selectedItem: {
                    path: itemList.path,
                  },
                  itemId: itemList.path,
                  selectedFolder: !selectedFolder ? itemList.path : null,
                  doubleClick: 1,
                })});
              }
            }
            if (doubleClick >= 1) {
              if (itemList.isFile) {
                openSelectedFile(itemList.path);
              } else {
                setState((prevState) => {console.log('prevState', prevState); return ({
                  ...prevState,
                  ...newState,
                })});
              }
            }
          };

          return (
            <IconCard
              key={itemList.path}
              isFolder={itemList.isFolder}
              isFile={itemList.isFile}
              isDisk={false}
              itemId={itemList.path}
              name={itemList.name}
              path={itemList.path}
              permission={itemList.permission}
              itemCount={itemList.itemCount}
              onClick={() => onClick()}
              onMouseLeave={onMouseLeave}
              setState={setState}
              visitedPaths={visitedPaths}
              selectedItem={selectedItem}
              selectedItemFile={selectedItemFile}
              currentPath={currentPath}
            />
          );
        });
        return items;
      }
      return <h2>Please wait...</h2>;
    }
  };

  const getFolderContentCallBack = useCallback(() => {
    getFolder({ folderPath: currentPath })
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
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
        }));
      }).catch((error) => {
        setState((prevState) => ({
          ...prevState,
          error,
          action: "",
        }));
      });
  }, [setState]);

  const getHardDrivesFolderContent = () => {
    getHardDrives()
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          diskData: res.data.hardDrives,
        }));
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          error,
          action: "",
        }));
      });
  };

  useEffect(() => {
    if (disksData.length === 0 && currentPath === COMPUTER) {
      getHardDrivesFolderContent();
    }
  }, [folderData.length, currentPath]);

  useEffect(() => {
    if (folderData.length === 0 || (selectedItem && doubleClick === 2 && currentPath !== COMPUTER)) {
      getFolderContentCallBack();
    }
  }, [getFolderContentCallBack, currentPath, folderData.length]);

  useEffect(() => {
    if (selectedItem && doubleClick === 2 && currentPath !== COMPUTER) {
      getFolderContentCallBack();
    }
  }, [
    getFolderContentCallBack,
    currentPath,
    doubleClick,
    folderData,
    selectedItem,
  ]);

  return (
    <Box
      id="contentWindowParent"
      sx={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #020102",
        borderLeft: "2px solid #020102",
        borderBottom: "2px solid #808080",
        borderRight: "2px solid #808080",
        height: "calc(100vh - 132px)",
        overflow: "scroll",
      }}
    >
      <Grid container id="contentWindow">{displayItemsAsIcons()}</Grid>
    </Box>
  );
};

export default WindowContentIconView;

WindowContentIconView.propTypes = {
  currentPath: PropTypes.string.isRequired,
  visitedPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  selectedItemFile: PropTypes.string.isRequired,
  selectedFolder: PropTypes.string.isRequired,
  doubleClick: PropTypes.number.isRequired,
  folderData: PropTypes.arrayOf(
    PropTypes.objectOf({
      isFile: PropTypes.bool,
      isFolder: PropTypes.bool,
      name: PropTypes.string,
      parentPath: PropTypes.string,
      path: PropTypes.string,
      size: PropTypes.string,
      itemCounts: PropTypes.string,
      permission: PropTypes.bool,
    })
  ).isRequired,
  disksData: PropTypes.arrayOf({
    permission: PropTypes.bool,
    filesystem: PropTypes.string,
    blocks: PropTypes.number,
    used: PropTypes.number,
    available: PropTypes.number,
    capacity: PropTypes.number,
    mounted: PropTypes.number,
  }).isRequired,
  action: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};
