import { useEffect, useCallback, JSX, useState } from "react";
import { Grid, Box, MenuItem, ListItemIcon, ListItemText, Menu } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import IconCard from "./IconCard";
import { openFile } from "../../data/methods";
import { ACTIONS, COMPUTER } from "../../constants/constants";
import { getFolder, getHardDrives, } from "../../data/methods";
import { Path } from "../../types/Path";
import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";
import { ContextMenuType } from "../../types/ContextMenuType";
import { HandleContextMenuEvent } from "../../types/HandleContextMenuEvent";

const WindowContentIconView = (): JSX.Element => {
  // getting state variables from react-redux store
  const state = useSelector((state: { appState: ReducerItems }) => ({
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

  const [contextMenu, setContextMenu] = useState<ContextMenuType>(null);

  const contextMenuItems = [
    {
      name: "Paste",
      action: ACTIONS.paste,
      icon: <ContentPasteIcon fontSize="small" />,
      disabled: action !== 'copy',
    },
    {
      name: "Create folder",
      action: ACTIONS.createFolder,
      icon: <CreateNewFolderIcon sx={{ color: "#cc6600" }} />,
    },
  ];

  function handleClickContextMenu(action: string) {
    dispatch(
      setState({ action}),
    );
    setContextMenu(null);
  };

  function displayContexMenuItems() {
    const menuItems = contextMenuItems.map((item) => {
      return (
        <MenuItem
          key={item.name}
          onClick={() => handleClickContextMenu(item.action)}
          disabled={item.disabled}
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

  const handleContextMenu = (event:HandleContextMenuEvent) => {
    event.preventDefault();
    if (
      event.target === document.getElementById("contentWindow")
      || event.target === document.getElementById("contentWindowParent")
      && event.type === "contextMenu"
  ) {
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
    }
  };

  const openSelectedFile = (path: Path["path"]) => {
    openFile({ path }).then((res) => {
      console.log(res);
    });
  };

  // when user is not hovering with a mouse over an tem
  // 'doubleClick' count resets to zero, so user can
  // click or double click on a next item
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
                selectedItem: { path: diskItem.mounted + "/" },
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
                  selectedItem: { path: itemList.path },
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
        const folderContent = res.data.folderContent;
        dispatch(setState({
          selectedItem: action === ACTIONS.copy ? selectedItem : null,
          selectedItemFile: action === ACTIONS.copy ? selectedItemFile : null,
          doubleClick: 0,
          folderData: folderContent.length === 0 ? [{ name: "" }] : folderContent,
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

  function anchorPositionCondition() {
    if (contextMenu) {
      return { top: contextMenu.mouseY, left: contextMenu.mouseX }
     }
     return undefined;
  }

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
        width: "calc(100% - 10px)",
        overflow: "scroll",
      }}
      onContextMenu={handleContextMenu}
    >
      <Grid 
        container
        direction="row"
        justifyContent="flex-start"
        alignContent="flex-start"
        id="contentWindow"
        sx={{ width: "100%", height: "100%" }}
      >
        {displayItemsAsIcons()}
      </Grid>
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={anchorPositionCondition()}
      >
        {displayContexMenuItems()}
      </Menu>
    </Box>
  );
};

export default WindowContentIconView;
