import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";

import { getHardDrives } from "../../data/methods";
import WindowTreeItems from "./WindowTreeItems";

function WindowTreeView(props) {
  const { state, setState } = props;

  const [disksData, setFdisksDatata] = useState([]);

  const getFolderContent = () => {
    getHardDrives().then((res) => {
      if (!res.data.err) {
      setFdisksDatata(res.data.hardDrives);
    }else {
      setState({
        ...state,
        error: res.data.err,
        action: "",
      });
    }});
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
        height: "calc(100vh - 127px)",
        overflow: "scroll",
      }}
    >
      <SimpleTreeView
        expandedItems={state.expandedItems}
        slots={{
          expandIcon: AddBoxIcon,
          collapseIcon: IndeterminateCheckBoxIcon,
        }}
      >
        <WindowTreeItems
          treeViewData={disksData}
          itemId="computer"
          name="Computer"
          path="Computer"
          isFolder
          state={state}
          setState={setState}
          onClick={() =>
            setState({
              ...state,
              visitedPaths: [...state.visitedPaths, "Computer"],
              currentPath: "Computer",
              currentPosition: state.visitedPaths.length,
            })
          }
        />
      </SimpleTreeView>
    </Box>
  );
}

export default WindowTreeView;

WindowTreeView.propTypes = {
  state: PropTypes.shape({
    expandedItems: PropTypes.arrayOf(PropTypes.string),
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setState: PropTypes.func.isRequired,
}
