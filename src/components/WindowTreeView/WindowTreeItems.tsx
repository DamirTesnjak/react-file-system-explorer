import React, { 
  useState,
  useEffect,
  useCallback,
  JSX,
} from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { uniq } from "lodash";
import { Box } from "@mui/material";

import { getFolder, openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import displayIcon from "../../utils/displayIcons";
import { WindowTreeItemsArgs } from "../../types/WindowTreeItemsArgs";
import { WindowTreeItemsProps } from "../../types/WindowTreeItemsProps";

const windowTreeItems = (args: WindowTreeItemsArgs): JSX.Element[] | undefined => {
  const {
    folderData,
    itemId,
    expandedItems,
    visitedPaths,
    setState
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
            setState={setState}
            permission={diskItem.permission}
            expandedItems={expandedItems}
            visitedPaths={visitedPaths}
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
            setState={setState}
            permission={itemList.permission}
            expandedItems={expandedItems}
            visitedPaths={visitedPaths}
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
    setState,
    permission,
    expandedItems,
    visitedPaths,
  } = props;
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
        setState((prevState) => ({
          ...prevState,
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
      setState((prevState) =>({
        ...prevState,
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
        expandedItems,
        visitedPaths,
        setState,
      })}
    </TreeItem>
  );
}

export default WindowTreeItems;