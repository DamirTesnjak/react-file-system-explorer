import { useState, useEffect, JSX } from "react";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { getHardDrives } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import { setStateMoveItem } from "../../app/moveItemSlice";
import { StateApp } from "../../types/StateApp";
import WindowTreeItemsMoveTo from "./WindowTreeItemsMoveTo";

function WindowTreeViewMoveTo(): JSX.Element {
  const state = useSelector((state: { moveItemState: StateApp }) => ({
    expandedItems: state.moveItemState.expandedItems,
    visitedPaths: state.moveItemState.visitedPaths,
    diskData: state.moveItemState.diskData,
  }), shallowEqual);
  const dispatch = useDispatch();

  console.log('state2', state);

  const {
    expandedItems,
    visitedPaths,
    diskData,
  } = state;

  const [disksData, setFdisksDatata] = useState(diskData);

  const getFolderContent = () => {
    getHardDrives().then((res) => {
      setFdisksDatata(res.data.hardDrives);
    }).catch((error) => {
      dispatch(setStateMoveItem({
        error,
        action: "",
      }));
    });
  };

  useEffect(() => {
    if (disksData.length === 0) {
      getFolderContent();
    }
  }, [disksData]);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderTop: "2px solid #020102",
        borderLeft: "2px solid #020102",
        borderBottom: "2px solid #808080",
        borderRight: "2px solid #808080",
        height: `calc(100vh - 170px)`,
        overflow: "scroll",
      }}
    >
      <SimpleTreeView
        expandedItems={expandedItems}
        slots={{
          expandIcon: AddBoxIcon,
          collapseIcon: IndeterminateCheckBoxIcon,
        }}
      >
        <WindowTreeItemsMoveTo
          treeViewData={disksData}
          itemId={COMPUTER}
          name={COMPUTER}
          path={COMPUTER}
          isFolder
          onClick={() =>
            dispatch(setStateMoveItem({
              visitedPaths: [...visitedPaths, COMPUTER],
              currentPath: COMPUTER,
              currentPosition: visitedPaths.length,
            }))
          }
        />
      </SimpleTreeView>
    </Box>
  );
}

export default WindowTreeViewMoveTo;
