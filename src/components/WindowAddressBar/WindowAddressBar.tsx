import { useState, JSX } from "react";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { uniq } from "lodash";

import { setState } from "../../app/appSlice";
import { StateApp } from "../../types/StateApp";

function WindowAddressBar(): JSX.Element {

  const state = useSelector((state: { appState: StateApp }) => ({
    currentPath: state.appState.currentPath,
    selectedItemFile: state.appState.selectedItemFile,
    selectedItem: state.appState.selectedItem,
    visitedPaths: state.appState.visitedPaths,
  }), shallowEqual);

  const { currentPath, visitedPaths } = state;
  const [selectedOption,selectOption] = useState(currentPath);

  const dispatch = useDispatch()

  const selectPath = () => {
    dispatch(setState({
      currentPath: selectedOption,
      folderData: [],
    }));
  };

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
