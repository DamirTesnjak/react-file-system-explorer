import React, { 
  useState,
  useEffect,
  useCallback,
} from 'react';

import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Window from './components/Window/Window';
import { initialValues } from './constants/constants';
import { getUserHomeFolder } from './data/methods';
import style from './style/style'

import './App.css';


const theme = createTheme(style);

// used to initialite icons to be displayed based on type of an item
initializeFileTypeIcons();

function App() {

  // initial state of variables that control
  // the content of folders to be displayed during
  // navigation
  const [state, setState] = useState(initialValues);
  const { visitedPaths, currentPath } = state;

  // gets the home directory of a user, based on OS
  const getHomeDir = useCallback(() => {
    getUserHomeFolder()
      .then((res) => {
        const homeFolder = res
          .data
          .homeFolder
          .replaceAll('\\', '/');

        setState({
          ...state,
          currentPath: homeFolder,
          visitedPaths: [...visitedPaths, homeFolder],
          numOfItemsFolder: 1,
        })
      });
  }, [state]);


  useEffect(() => {
    if (currentPath?.length === 0) {
      getHomeDir();
    }
  }, [getHomeDir, currentPath]);

  return (
    <ThemeProvider theme={theme}>
      <Window
        setState={(s) => setState(s)}
        state={state}
      />
      </ThemeProvider>
  );
}

export default App;
