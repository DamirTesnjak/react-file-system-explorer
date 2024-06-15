import React from "react";
import PropTypes from 'prop-types';
import { Box } from "@mui/material";

function WindowTitle(props) {
  const { state } = props;

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
      {state.currentPath}
    </Box>
  );
}

export default WindowTitle;
WindowTitle.propTypes = {
  state: PropTypes.shape({
    currentPath: PropTypes.string
  }).isRequired
}
