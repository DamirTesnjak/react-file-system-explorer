import React, { Grid } from "@mui/material";
import PropTypes from 'prop-types';

import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";
import WindowAddressBar from "../WindowAddressBar/WindowAddressBar";

function Window(props) {
  const { setState, state } = props;
  const {
    folderData,
    diskData,
    doubleClick,
    currentPath,
    currentPosition,
    visitedPaths,
    expandedItems,
    action,
    error,
    itemType,
    selectedItem,
    selectedItemFile,
    selectedFolder, 
  } = state;

  return (
    <Grid
      container
      spacing={2}
      sx={{ backgroundColor: "#c0c7c8" }}
    >
      <Grid item xs={12}>
        <WindowTitle currentPath={currentPath}/>
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "2px !important" }}>
        <WindowToolbar
          currentPath={currentPath}
          currentPosition={currentPosition}
          visitedPaths={visitedPaths}
          action={action}
          error={error}
          itemType={itemType}
          selectedItem={selectedItem}
          selectedItemFile={selectedItemFile}
          selectedFolder={selectedFolder}
          setState={setState}
        />
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
        <WindowAddressBar
          currentPath={currentPath}
          visitedPaths={visitedPaths}
          setState={setState}
        />
      </Grid>
      <Grid item xs={2}>
        <WindowTreeView
          expandedItems={expandedItems}
          visitedPaths={visitedPaths}
          disksData={diskData}
          setState={setState}
        />
      </Grid>
      <Grid item xs={10}>
        <WindowContentIconView
          currentPath={currentPath}
          folderData={folderData}
          disksData={diskData}
          doubleClick={doubleClick}
          visitedPaths={visitedPaths}
          selectedFolder={selectedFolder}
          selectedItem={selectedItem}
          selectedItemFile={selectedItemFile}
          action={action}
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
    diskData: PropTypes.arrayOf({
      permission: PropTypes.bool,
      filesystem: PropTypes.string,
      blocks: PropTypes.number,
      used: PropTypes.number,
      available: PropTypes.number,
      capacity: PropTypes.number,
      mounted: PropTypes.number,
    }).isRequired,
    action: PropTypes.string.isRequired,
    error: PropTypes.shape({
      errno: PropTypes.number,
      code: PropTypes.string,
      sysCall: PropTypes.string,
      path: PropTypes.string,
    }),
  })
}
