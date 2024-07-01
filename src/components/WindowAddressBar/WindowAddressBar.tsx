import { useState, JSX, useEffect } from "react";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { uniq } from "lodash";

import { setState } from "../../app/appSlice";
import { ReducerItems } from "../../types/ReducerItems";

function WindowAddressBar(): JSX.Element {

  // getting state variables from react-redux store
  const state = useSelector((state: { appState: ReducerItems }) => ({
    currentPath: state.appState.currentPath,
    selectedItemFile: state.appState.selectedItemFile,
    selectedItem: state.appState.selectedItem,
    visitedPaths: state.appState.visitedPaths,
  }), shallowEqual);

  const { currentPath, visitedPaths } = state;
  const [selectedOption, selectOption] = useState(currentPath);

  const dispatch = useDispatch()

  const selectPath = () => {
    dispatch(setState({
      currentPath: selectedOption,
      folderData: [],
    }));
  };

  // necessary to catch a change in 'currentPath' when user
  // navigates across folders
  useEffect(() => selectOption(currentPath), [currentPath]);

  return (
    <Box>
      <Box sx={{ display: "inline-block" }}>
        <Button
          sx={{ marginTop: '12px' }}
          endIcon={<ArrowForwardIcon sx={{ color: "#66ffff" }} />}
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
