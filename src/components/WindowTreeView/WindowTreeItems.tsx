import { 
  useState,
  useEffect,
  useCallback,
  JSX,
} from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { uniq } from "lodash";
import { Box } from "@mui/material";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { getFolder, openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import displayIcon from "../../utils/displayIcons";
import { WindowTreeItemsArgs } from "../../types/WindowTreeItemsArgs";
import { WindowTreeItemsProps } from "../../types/WindowTreeItemsProps";
import { setState } from "../../app/appSlice";
import { StateApp } from "../../types/StateApp";

const windowTreeItems = (args: WindowTreeItemsArgs): JSX.Element[] | undefined => {
  const {
    folderData,
    itemId,
  } = args;
  if (itemId === COMPUTER) {
    if (folderData && folderData.length > 0) {
      const items = folderData.map((diskItem) => {
        return (
          <WindowTreeItems
            key={diskItem.mounted + "/"}
            isFolder={diskItem.isDisk}
            isDisk={diskItem.isDisk}
            itemId={diskItem.mounted + "/"}
            name={diskItem.filesystem + " " + diskItem.mounted}
            path={diskItem.mounted + "/"}
            permission={diskItem.permission}
          />
        );
      });
      return items;
    }
  } else {
    if (folderData && folderData.length > 0) {
      const items = folderData.map((itemList) => {
        return (
          <WindowTreeItems
            key={itemList.path}
            isFolder={itemList.isFolder}
            isFile={itemList.isFile}
            itemId={itemList.path}
            name={itemList.name}
            path={itemList.path}
            permission={itemList.permission}
          />
        );
      });
      return items;
    }
  }
  return undefined;
};

function WindowTreeItems(props: WindowTreeItemsProps) {
  const {
    itemId,
    treeViewData,
    isFolder,
    isFile,
    isDisk,
    name,
    path,
    permission,
  } = props;
  const state = useSelector((state: { appState: StateApp }) => ({
    expandedItems: state.appState.expandedItems,
    visitedPaths: state.appState.visitedPaths,
  }), shallowEqual);
  const {
    expandedItems,
    visitedPaths,
  } = state;
  const dispatch = useDispatch();

  const [folderData, setFolderData] = useState(treeViewData);

  const getFolderContent = useCallback(() => {
    getFolder({ folderPath: path })
      .then((res) => {
        const duplicates = [...expandedItems].filter(
          (e) => e === itemId
        ).length;
        const filteredExpandedItems = [...expandedItems].filter(
          (e) => e !== itemId
        );
        setFolderData(res.data.folderContent);
        dispatch(setState({
          itemId,
          expandedItems:
            duplicates > 0
              ? uniq(filteredExpandedItems)
              : [...expandedItems, itemId],
          currentPath: path,
          visitedPaths: [...visitedPaths, path],
          currentPosition: visitedPaths.length,
          folderData: [],
        }));
    }).catch((error) => {
      dispatch(setState({
        error,
        action: "",
      }));
    });;
  }, [itemId, path, setState]);

  const openSelectedFile = () => {
    openFile({ path: path }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    if (!folderData) {
      getFolder({ folderPath: path }).then((res) => {
        setFolderData(res.data.folderContent);
      });
    }
  }, [folderData, itemId, path, setState]);

  const expandItemList = () => {
    getFolderContent();
  };


  return (
    <TreeItem
      itemId={itemId}
      label={<Box>
        {displayIcon({
          permission,
          isFolder,
          isFile,
          isDisk,
          name,
          itemId,
        })}
        {name}
      </Box>}
      onClick={() => (!isFolder ? openSelectedFile() : expandItemList())}
    >
      {windowTreeItems({
        folderData: folderData && folderData.length > 0 ? folderData : treeViewData,
        itemId,
      })}
    </TreeItem>
  );
}

export default WindowTreeItems;