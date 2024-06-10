import { useState, useEffect, useCallback } from 'react';

import Window from './components/Window/Window';
import { getUserHomeFolder } from './data/methods';
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";

import './App.css';

initializeFileTypeIcons();

function App() {
  const [state, setState] = useState({
    currentPath: '',
    itemId: '',
    visitedPaths: [],
    currentPosition: 0,
    expandedItems: [],
    selectedItem: null,
    selectedItemFile: null,
    selectedFolder: null,
    itemType: null,
    doubleClick: 0,
    folderData: [],
    action: '',
  });

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

  console.log('state', state);

  return (
      <Window
        visitedPaths={state.visitedPaths}
        currentPath={state.currentPath}
        currentPosition={state.currentPosition}
        itemId={state.itemId}
        setState={(s) => setState(s)}
        state={state}
      />
  );
}

export default App;
