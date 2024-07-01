import { Box } from "@mui/material";
import { shallowEqual, useSelector } from 'react-redux'
import { ReducerItems } from "../../types/ReducerItems";

function WindowTitle() {
  // getting state variables from react-redux store
  const currentPath = useSelector((state: { moveItemState: ReducerItems }) => state.moveItemState.currentPath, shallowEqual);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(228,245,255,1) 98%)",
        height: "25px",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: 600,
        paddingLeft: "20px",
      }}
    >
      { `Move item to: ${currentPath}` }
    </Box>
  );
}

export default WindowTitle;