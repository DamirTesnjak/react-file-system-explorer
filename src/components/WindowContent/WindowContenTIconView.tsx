import { useEffect, useCallback, JSX, useMemo } from "react";
import { Grid, Box } from "@mui/material";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import IconCard from "./IconCard";
import { openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import { getFolder, getHardDrives, } from "../../data/methods";
import { Path } from "../../types/Path";
import { setState } from "../../app/appSlice";
import { StateApp } from "../../types/StateApp";

const WindowContentIconView = (): JSX.Element => {
  const state = useSelector((state: { appState: StateApp }) => ({
    folderData: state.appState.folderData,
    diskData: state.appState.diskData,
    doubleClick: state.appState.doubleClick,
    selectedFolder: state.appState.selectedFolder,
    visitedPaths: state.appState.visitedPaths,
    selectedItem: state.appState.selectedItem,
    selectedItemFile: state.appState.selectedItemFile,
    currentPath: state.appState.currentPath,
    action: state.appState.action,
  }), shallowEqual);
  const dispatch = useDispatch();

  const {
    folderData,
    diskData,
    doubleClick,
    selectedFolder,
    visitedPaths,
    selectedItem,
    selectedItemFile,
    currentPath,
    action,
  } = state;

  const openSelectedFile = (path: Path["path"]) => {
    openFile({ path }).then((res) => {
      console.log(res);
    });
  };

  const onMouseLeave = () => {
    dispatch(setState({
      doubleClick: 0,
    }));
  };

  const displayItemsAsIcons = () => {
    if (currentPath === COMPUTER) {
      if (diskData && diskData.length > 0) {
        const items = diskData.map((diskItem) => {
          const newState = {
            visitedPaths: [...visitedPaths, diskItem.mounted + "/"],
            currentPath: diskItem.mounted + "/",
            currentPosition: visitedPaths.length,
            folderData: [],
          };

          const onClick = () => {
            if (doubleClick === 0) {
              dispatch(setState({
                selectedItem: {
                  path: diskItem.mounted + "/",
                },
                doubleClick: 1,
              }));
            }
            if (doubleClick >= 1) {
              dispatch(setState({
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
          };

          const onClick = () => {
            if (doubleClick === 0) {
              if (itemList.isFile) {
                dispatch(setState({
                  selectedItemFile: {
                    path: itemList.path,
                  },
                  selectedFolder: null,
                  doubleClick: 1,
                  itemId: itemList.path,
                  itemType: "file",
                }));
              }
              if (itemList.isFolder) {
                dispatch(setState({
                  selectedItem: {
                    path: itemList.path,
                  },
                  itemId: itemList.path,
                  selectedFolder: !selectedFolder ? itemList.path : null,
                  doubleClick: 1,
                }));
              }
            }
            if (doubleClick >= 1) {
              if (itemList.isFile) {
                openSelectedFile(itemList.path);
              } else {
                dispatch(setState({
                  ...newState
                }));
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
              onClick={() => onClick()}
              onMouseLeave={onMouseLeave}
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
        dispatch(setState({
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
        dispatch(setState({
          error,
          action: "",
        }));
      });
  }, [currentPath]);

  const getHardDrivesFolderContent = () => {
    getHardDrives()
      .then((res) => {
        dispatch(setState({
          diskData: res.data.hardDrives,
        }));
      })
      .catch((error) => {
        dispatch(setState({
          error,
          action: "",
        }));
      });
  };

  useEffect(() => {
    if (diskData.length === 0 && currentPath === COMPUTER) {
      getHardDrivesFolderContent();
    }
  }, [folderData.length, currentPath]);

  useEffect(() => {
    if ((folderData.length === 0 && currentPath && currentPath.length > 0) || (selectedItem && doubleClick === 2 && currentPath !== COMPUTER)) {
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
