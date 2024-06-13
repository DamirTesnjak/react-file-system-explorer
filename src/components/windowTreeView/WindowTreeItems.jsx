import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { uniq } from "lodash";

import { getFolder, openFile } from "../../data/methods";

const windowTreeItems = (args) => {
  const { folderData, itemId, state, setState } = args;
  if (itemId === "computer") {
    if (folderData && folderData.length > 0) {
      const items = folderData.map((diskItem) => {
        return (
          <WindowTreeItems
            key={diskItem.mounted + "/"}
            type="folder"
            itemId={diskItem.mounted + "/"}
            name={diskItem.filesystem + " " + diskItem.mounted}
            path={diskItem.mounted + "/"}
            state={state}
            setState={setState}
          />
        );
      });
      return items;
    }
  } else {
    if (folderData && folderData.length > 0) {
      const setType = (itemList) => {
        if (itemList.name.includes("$")) {
          return "folder";
        }
        if (itemList.name.includes(".")) {
          return "file";
        }
      };
      const items = folderData.map((itemList) => {
        return (
          <WindowTreeItems
            key={itemList.path}
            type={setType(itemList)}
            itemId={itemList.path}
            name={itemList.name}
            path={itemList.path}
            itemCount={itemList.itemCount}
            state={state}
            setState={setState}
          />
        );
      });
      return items;
    }
  }
};

function WindowTreeItems(props) {
  const { itemId, treeViewData, type, name, path, state, setState } = props;
  const [folderData, setFolderData] = useState(treeViewData);

  const getFolderContent = useCallback(() => {
    getFolder({ folderPath: path }).then((res) => {
      const duplicates = [...state.expandedItems].filter(
        (e) => e === itemId
      ).length;
      const filteredExpandedItems = [...state.expandedItems].filter(
        (e) => e !== itemId
      );
      console.log("duplicates", duplicates);
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
      label={name}
      onClick={() => (type === "file" ? openSelectedFile() : expandItemList())}
    >
      {windowTreeItems({
        folderData:
          folderData && folderData.length > 0 ? folderData : treeViewData,
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
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  state: PropTypes.shape({
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
    expandedItems: PropTypes.arrayOf(PropTypes.string),
  }),
  setState: PropTypes.func.isRequired,
};

WindowTreeItems.defaultProps = {
  type: null,
};
