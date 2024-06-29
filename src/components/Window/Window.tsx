import { JSX } from "react";
import { Grid } from "@mui/material";
import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";
import WindowAddressBar from "../WindowAddressBar/WindowAddressBar";

function Window(): JSX.Element {
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
        <WindowTreeView />
      </Grid>
      <Grid item xs={10}>
        <WindowContentIconView />
      </Grid>
    </Grid>
  );
}

export default Window;
