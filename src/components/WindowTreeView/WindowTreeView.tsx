import React, { useState, useEffect, JSX } from "react";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

import { getHardDrives } from "../../data/methods";
import { COMPUTER } from "../../constants/constants";
import WindowTreeItems from "./WindowTreeItems";
import { WindowTreeViewProps } from "../../types/WindowTreeViewProps";

function WindowTreeView(props: WindowTreeViewProps): JSX.Element {
  const {
    dialogOpened, 
    expandedItems,
    visitedPaths,
    disksData,
    setState,
  } = props;

  const [disksData2, setFdisksDatata] = useState(disksData);

  const getFolderContent = () => {
    getHardDrives().then((res) => {
      setFdisksDatata(res.data.hardDrives);
    }).catch((error) => {
      setState((prevState) => ({
        ...prevState,
        error,
        action: "",
      }));
    });
  };

  useEffect(() => {
    if (disksData2.length === 0) {
      getFolderContent();
    }
  }, [disksData2]);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderTop: "2px solid #020102",
        borderLeft: "2px solid #020102",
        borderBottom: "2px solid #808080",
        borderRight: "2px solid #808080",
        height: `calc(100vh - ${dialogOpened ? '170px': '132px'})`,
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
          treeViewData={disksData2}
          itemId={COMPUTER}
          name={COMPUTER}
          path={COMPUTER}
          isFolder
          setState={setState}
          expandedItems={expandedItems}
          visitedPaths={visitedPaths}
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
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

export default WindowTreeView;
