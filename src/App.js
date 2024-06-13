import React, { 
  useState,
  useEffect,
  useCallback,
} from 'react';

import Window from './components/Window/Window';
import { getUserHomeFolder } from './data/methods';
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import style from './style/style'
import './App.css';


const theme = createTheme(style);

// used to initialite icons to be displayed based on type of an item
initializeFileTypeIcons();

function App() {

  // initial state of variables that control
  // the content of folders to be displayed during
  // navigation
  const [state, setState] = useState({
    currentPath: '',        // holds the current path pf a visited folder
    itemId: '',
    visitedPaths: [],       // holds zhe array of visited paths during the session
    currentPosition: 0,     // used as index in "visitedPaths" to get prevous visited path when navigating back in "history"
    expandedItems: [],      // holds value of all expanded items in "TreeView"
    selectedItem: null,     // holds the data of a selected item after one click
    selectedItemFile: null, // holds the data of a selected file after one click
    selectedFolder: null,   // holds the data of a selected folder after one click
    itemType: null,         // type of selected item, "folder" or "file" as string
    doubleClick: 0,         // used to detect when double click happens
    folderData: [],         // contains array of item to be displayed in window
    action: '',             // action "copy", "paste", "delete", "create"
    error: null,            // hold any kind off error to be displayed on screen, when something goes wrong
  });

  // gets the home directory of a user, based on OS
  const getHomeDir = useCallback(() => {
    getUserHomeFolder()
      .then((res) => {
        setState({
          ...state,
          currentPath: res.data.homeFolder.replaceAll('\\', '/'),
          visitedPaths: [...state.visitedPaths, res.data.homeFolder.replaceAll('\\', '/')],
          numOfItemsFolder: 1,
        })
      });
  }, [state]);


  useEffect(() => {
    if (state.currentPath?.length === 0) {
      getHomeDir();
    }
  }, [getHomeDir, state.currentPath]);

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
