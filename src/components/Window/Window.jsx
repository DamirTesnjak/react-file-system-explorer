import { Grid } from "@mui/material";
import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../WindowToolbar/WindowToolbar";

function Window(props) {
  const { currentPath, itemId, setState, state } = props;
  return (
    <Grid container spacing={2} sx={{ backgroundColor: "#f2f2f2" }}>
      <Grid item xs={12}>
        <WindowTitle currentPath={currentPath} />
      </Grid>
      <Grid item xs={12}>
        <WindowToolbar
          currentPath={currentPath}
          state={state}
          setState={setState}
        />
      </Grid>
      <Grid item xs={3}>
        <WindowTreeView state={state} setState={setState} />
      </Grid>
      <Grid item xs={9}>
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
