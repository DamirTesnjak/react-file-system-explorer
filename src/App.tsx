import {
  JSX,
  useEffect,
  useCallback,
} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';

import Window from './components/Window/Window';
import { getUserHomeFolder } from "./data/methods";
import { setState } from "./app/appSlice";
import style from './style/style';
import { ReducerItems } from './types/ReducerItems';
import './App.css';

const theme = createTheme(style as ThemeOptions);

// used to initialite icons to be displayed based on type of an item
initializeFileTypeIcons();

function App(): JSX.Element {
  const state = useSelector((state: { appState: ReducerItems }) => ({
    currentPath: state.appState.currentPath,
    selectedItemFile: state.appState.selectedItemFile,
    selectedItem: state.appState.selectedItem,
    visitedPaths: state.appState.visitedPaths,
  }) , shallowEqual);

  const dispatch = useDispatch()

  const {
    currentPath,
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

        dispatch(setState({
          currentPath: homeFolder,
          visitedPaths: [...visitedPaths, homeFolder],
        }))
      });
  }, []);

  useEffect(() => {
    if (currentPath?.length === 0) {
      getHomeDir();
    }
  }, [currentPath, getHomeDir])

  useEffect(() => {
    function handleRightClick(e: Event) {
      console.log('e', e);
      if (e.target === document.getElementById("contentMain") && e.type === "contextMenu") {
        console.log("right click");
      }
    }
    if (!state.selectedItem?.path && !state.selectedItemFile?.path) {
      window.addEventListener('contextMenu', (e) => handleRightClick(e))
      return window.removeEventListener('contextMenu', (e) => handleRightClick(e))
    }
  }, [state.selectedItem?.path, state.selectedItemFile?.path])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.target === document.getElementById("contentWindow") || e.target === document.getElementById("contentWindowParent") && e.type === "click") {
        dispatch(setState({
          selectedItemFile: null,
          selectedItem: null,
          action: "",
          itemType: null,
          doubleClick: 0,
        }))
      }
    }
    if (state.selectedItem?.path || state.selectedItemFile?.path) {
      window.addEventListener('click', (e) => handleClick(e))
      return window.removeEventListener('click', (e) => handleClick(e))
    }
  }, [state.selectedItem?.path, state.selectedItemFile?.path])

  return (
    <ThemeProvider theme={theme}>
      <Window />
    </ThemeProvider>
  );
}

export default App;
