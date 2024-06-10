import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { uniq } from "lodash";

function WindowAddressBar(props) {
  const { state, setState } = props;
  const [selectedOption, selectOption] = useState(state.currentPath);

  const selectPath = () => {
    setState({
      ...state,
      currentPath: selectedOption,
      folderData: [],
    });
  };

  useEffect(() => selectOption(state.currentPath), [state.currentPath]);

  return (
    <Box>
      <Button sx={{ display: "inline-block" }} onClick={() => selectPath()}>
        Go
      </Button>
      <Box sx={{
        display: "inline-block",
        width: '50%'
    }}>
        <Autocomplete
          freeSolo
          value={selectedOption}
          onChange={(event, newValue) => selectOption(newValue)}
          options={uniq(state.visitedPaths)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </Box>
  );
}

export default WindowAddressBar;
