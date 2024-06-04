import { Grid } from "@mui/material";
import WindowTreeView from "../WindowTreeView/WindowTreeView";
import WindowContentIconView from "../WindowContent/WindowContenTIconView";
import WindowTitle from "../WindowTitle/WindowTitle";
import WindowToolbar from "../windowToolbar/WindowToolbar";

function Window() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <WindowTitle />
            </Grid>
            <Grid item xs={12}>
                <WindowToolbar />
            </Grid>
            <Grid item xs={3}>
                <WindowTreeView />
            </Grid>
            <Grid item xs={9}>
                <WindowContentIconView />
            </Grid>
        </Grid>
    );
}

export default Window;