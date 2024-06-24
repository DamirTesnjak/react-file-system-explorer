import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { uniq } from "lodash";
import { Box } from "@mui/material";

import { getFolder, openFile } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import displayIcon from "../../utils/displayIcons";

const windowTreeItems = (args) => {
  const { folderData, itemId, state, setState } = args;
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
            state={state}
            setState={setState}
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
            itemCount={itemList.itemCount}
            state={state}
            setState={setState}
            permission={itemList.permission}
          />
        );
      });
      return items;
    }
  }
};

function WindowTreeItems(props) {
  const {
    itemId,
    treeViewData,
    isFolder,
    isFile,
    isDisk,
    name,
    path,
    state,
    setState,
    permission,
  } = props;
  const [folderData, setFolderData] = useState(treeViewData);

  const getFolderContent = useCallback(() => {
    getFolder({ folderPath: path }).then((res) => {
      const duplicates = [...state.expandedItems].filter(
        (e) => e === itemId
      ).length;
      const filteredExpandedItems = [...state.expandedItems].filter(
        (e) => e !== itemId
      );
      setFolderData(res.data.folderContent);
      if (!res.data.err) {
        setState({
          ...state,
          itemId,
          expandedItems:
            duplicates > 0
              ? uniq(filteredExpandedItems)
              : [...state.expandedItems, itemId],
          currentPath: path,
          visitedPaths: [...state.visitedPaths, path],
          currentPosition: state.visitedPaths.length,
          folderData: [],
          numOfItemsFolder: 1,
        });
      } else {
        setState({
          ...state,
          error: res.data.err,
          action: "",
        });
      }
    });
  }, [itemId, path, setState, state]);

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
  }, [folderData, itemId, path, setState, state]);

  const expandItemList = () => {
    getFolderContent();
  };

  return (
    <TreeItem
      itemId={itemId}
      label={<Box>
        {displayIcon({
          permission,
          state,
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
        state,
        setState,
      })}
    </TreeItem>
  );
}

export default WindowTreeItems;

WindowTreeItems.propTypes = {
  itemId: PropTypes.string.isRequired,
  treeViewData: PropTypes.arrayOf({
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
  }),
  isFolder: PropTypes.bool,
  isFile: PropTypes.bool,
  isDisk: PropTypes.bool,
  permission: PropTypes.bool,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  state: PropTypes.shape({
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
    expandedItems: PropTypes.arrayOf(PropTypes.string),
  }),
  setState: PropTypes.func.isRequired,
};

WindowTreeItems.defaultProps = {
  isFolder: false,
  isFile: false,
  isDisk: false,
};
