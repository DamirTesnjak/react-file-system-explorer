import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { uniq } from "lodash";

function WindowAddressBar(props) {
  const { state, setState } = props;
  const { currentPath, visitedPaths } = state;
  const [selectedOption, selectOption] = useState(currentPath);

  const selectPath = () => {
    setState({
      ...state,
      currentPath: selectedOption,
      folderData: [],
    });
  };

  useEffect(() => selectOption(currentPath), [currentPath]);

  return (
    <Box>
      <Box sx={{ display: "inline-block" }}>
        <Button
          sx={{ marginTop: '12px'}}
          endIcon={<ArrowForwardIcon sx={{ color: "#66ffff" }}/>} 
          onClick={() => selectPath()}>
          Go
        </Button>
      </Box>
      <Box sx={{
        display: "inline-block",
        width: '50%'
    }}>
        <Autocomplete
          freeSolo
          value={selectedOption}
          onChange={(event, newValue) => selectOption(newValue)}
          options={uniq(visitedPaths)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </Box>
  );
}

export default WindowAddressBar;

WindowAddressBar.propTypes = {
  state: PropTypes.shape({
    currentPath: PropTypes.string,
    visitedPaths: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setState: PropTypes.func.isRequired,
}
