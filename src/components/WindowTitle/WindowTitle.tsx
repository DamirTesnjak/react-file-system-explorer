import React from "react";
import { Box } from "@mui/material";
import { WindowTitleProps } from "../../types/WindowTitleProps";

function WindowTitle(props: WindowTitleProps) {
  const { currentPath } = props;

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
      {currentPath}
    </Box>
  );
}

export default WindowTitle;