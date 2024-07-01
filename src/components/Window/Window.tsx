import { JSX } from "react";
import { Grid } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";

import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";
import WindowAddressBar from "../WindowAddressBar/WindowAddressBar";
import { ReducerItems } from "../../types/ReducerItems";
import { setState } from "../../app/appSlice";

function Window(): JSX.Element {
  const stateTreeView = useSelector((state: { appState: ReducerItems }) => ({
    expandedItems: state.appState.expandedItems,
    visitedPaths: state.appState.visitedPaths,
    diskData: state.appState.diskData,
  }), shallowEqual);

  return (
    <Grid
      container
      spacing={2}
      sx={{ backgroundColor: "#c0c7c8" }}
    >
      <Grid item xs={12}>
        <WindowTitle />
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "2px !important" }}>
        <WindowToolbar />
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "0px !important" }}>
        <WindowAddressBar />
      </Grid>
      <Grid item xs={2}>
        <WindowTreeView
          state={stateTreeView}
          setState={setState}
        />
      </Grid>
      <Grid item xs={10}>
        <WindowContentIconView />
      </Grid>
    </Grid>
  );
}

export default Window;
