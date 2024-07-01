import { 
  useState,
  useEffect,
  useCallback,
  JSX,
} from "react";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { uniq } from "lodash";
import { Box } from "@mui/material";
import { useDispatch} from 'react-redux'

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
    setState,
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
            expandedItems={expandedItems}
            visitedPaths={visitedPaths}
            setState={setState}
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
            expandedItems={expandedItems}
            visitedPaths={visitedPaths}
            setState={setState}
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
    expandedItems,
    visitedPaths,
    setState
  } = props;

  const dispatch = useDispatch();

  const [folderData, setFolderData] = useState(treeViewData);

  const getFolderContent = useCallback(() => {
    getFolder({ folderPath: path })
      .then((res) => {
        const numOfDuplicates = [...expandedItems].filter((e) => e === itemId).length;
        const filteredExpandedItems = [...expandedItems]
          .filter((e) => e !== itemId);
        setFolderData(res.data.folderContent);
        dispatch(setState({
          itemId,
          expandedItems: numOfDuplicates > 0
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

  // opens any file
  const openSelectedFile = () => {
    openFile({ path: path }).then((res) => {
      console.log(res);
    });
  };

  // on first initialize fetches content of the folder to be later displayed in treeView
  useEffect(() => {
    if (!folderData) {
      getFolder({ folderPath: path }).then((res) => {
        setFolderData(res.data.folderContent);
      });
    }
  }, [folderData, itemId, path, setState]);

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
      // onClick opens a file or fetch content of the expanded folder to be displayed in treeView
      onClick={() => (!isFolder ? openSelectedFile() : getFolderContent())}
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