import React, { JSX } from "react";
import { Grid } from "@mui/material";
import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";
import WindowAddressBar from "../WindowAddressBar/WindowAddressBar";
import { WindowProps } from "../../types/WindowProps";

function Window(props: WindowProps): JSX.Element {
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
