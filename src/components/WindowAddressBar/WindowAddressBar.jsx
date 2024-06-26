import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { uniq } from "lodash";

function WindowAddressBar(props) {
  const { currentPath, visitedPaths, setState } = props;
  const [selectedOption, selectOption] = useState(currentPath);

  const selectPath = () => {
    setState((prevState) => ({
      ...prevState,
      currentPath: selectedOption,
      folderData: [],
    }));
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
        width: 'calc(100% - 70px)'
    }}>
        <Autocomplete
          freeSolo
          value={selectedOption || currentPath}
          onChange={(_event, newValue) => selectOption(newValue)}
          options={uniq(visitedPaths)}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => selectOption(e.target.value)}
            />)
          }
        />
      </Box>
    </Box>
  );
}

export default WindowAddressBar;

WindowAddressBar.propTypes = {
  currentPath: PropTypes.string.isRequired,
  visitedPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
  setState: PropTypes.func.isRequired,
}
