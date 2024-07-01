import { useState, useEffect, JSX } from "react";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useDispatch } from 'react-redux'

import { getHardDrives } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import WindowTreeItems from "./WindowTreeItems";
import { WindowTreeViewProps } from "../../types/WindowTreeViewProps";

function WindowTreeView(props: WindowTreeViewProps): JSX.Element {
  const { setState, state } = props;

  const dispatch = useDispatch();

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
      dispatch(setState({
        error,
        action: "",
      }));
    });
  };

  useEffect(() => {
    if (disksData?.length === 0) {
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
        height: `calc(100vh - 132px)`,
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
        <WindowTreeItems
          treeViewData={disksData}
          itemId={COMPUTER}
          name={COMPUTER}
          path={COMPUTER}
          isFolder
          expandedItems={expandedItems}
          visitedPaths={visitedPaths}
          setState={setState}
          onClick={() =>
            dispatch(setState({
              visitedPaths: [...visitedPaths, COMPUTER],
              currentPath: COMPUTER,
              currentPosition: visitedPaths?.length,
            }))
          }
        />
      </SimpleTreeView>
    </Box>
  );
}

export default WindowTreeView;
