import React, { Grid } from "@mui/material";
import PropTypes from 'prop-types';

import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";
import WindowAddressBar from "../WindowAddressBar/WindowAddressBar";

function Window(props) {
  const { setState, state } = props;
  return (
    <Grid
      container
      spacing={2}
      sx={{ backgroundColor: "#c0c7c8" }}
    >
      <Grid item xs={12}>
        <WindowTitle state={state}/>
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "2px !important" }}>
        <WindowToolbar
          state={state}
          setState={setState}
        />
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
        <WindowAddressBar
          state={state}
          setState={setState}
        />
      </Grid>
      <Grid item xs={2}>
        <WindowTreeView state={state} setState={setState} />
      </Grid>
      <Grid item xs={10}>
        <WindowContentIconView
          state={state}
          setState={setState}
        />
      </Grid>
    </Grid>
  );
}

export default Window;

Window.propTypes = {
  setState: PropTypes.func.isRequired,
  state: PropTypes.shape({
    currentPath: PropTypes.string,
    itemId: PropTypes.string,
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
    currentPosition: PropTypes.number,
    expandedItems: PropTypes.arrayOf(PropTypes.string),
    selectedItem: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedItemFile: PropTypes.shape({
      path: PropTypes.string,
    }),
    selectedFolder: PropTypes.string,
    itemType: PropTypes.string,
    doubleClick: PropTypes.number,
    folderData: PropTypes.arrayOf({
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
    action: PropTypes.string.isRequired,
    error: PropTypes.shape({
      errno: PropTypes.number,
      code: PropTypes.string,
      sysCall: PropTypes.string,
      path: PropTypes.string,
    }),
  })
}
