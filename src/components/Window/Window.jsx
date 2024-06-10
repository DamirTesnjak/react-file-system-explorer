import { Grid } from "@mui/material";
import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";
import WindowAddressBar from "../WindowAddressBar/WindowAddressBar";

function Window(props) {
  const { currentPath, itemId, setState, state } = props;
  return (
    <Grid container spacing={2} sx={{ backgroundColor: "#c0c7c8" }}>
      <Grid item xs={12}>
        <WindowTitle currentPath={currentPath} />
      </Grid>
      <Grid item xs={12} sx={{ paddingTop: "2px !important" }}>
        <WindowToolbar
          currentPath={currentPath}
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
          currentPath={currentPath}
          itemId={itemId}
          state={state}
          setState={setState}
        />
      </Grid>
    </Grid>
  );
}

export default Window;
