import React, {
  JSX,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';

import Window from './components/Window/Window';
import { initialValues } from './constants/constants';
import { getUserHomeFolder } from "./data/methods";
import { StateApp } from './types/StateApp';
import style from './style/style'

import './App.css';


const theme = createTheme(style as ThemeOptions);

// used to initialite icons to be displayed based on type of an item
initializeFileTypeIcons();

function App(): JSX.Element {

  // initial state of variables that control
  // the content of folders to be displayed during
  // navigation
  const [state, setState] = useState<StateApp>(initialValues);
  const {
    currentPath,
    selectedItemFile,
    selectedItem,
    visitedPaths,
  } = state;

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
        })
      });
  }, [state]);

  useEffect(() => {
    if (currentPath?.length === 0) {
      getHomeDir();
    }
  }, [selectedItem?.path, selectedItemFile?.path, currentPath, getHomeDir])

  useEffect(() => {
    function handleClickIconCard(e: MouseEvent) {
      if (e.target === document.getElementById("contentWindow") || e.target === document.getElementById("contentWindowParent")) {
        setState({
          ...state,
          selectedItemFile: null,
          selectedItem: null,
          action: "",
          itemType: null,
          doubleClick: 0,
        })
      }
    }
    if (state.selectedItem?.path || state.selectedItemFile?.path) {
      window.addEventListener('mousedown', (e) => handleClickIconCard(e))
      return window.removeEventListener('mousedown', (e) => handleClickIconCard(e))
    }
  }, [state.selectedItem?.path, state.selectedItemFile?.path])

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
