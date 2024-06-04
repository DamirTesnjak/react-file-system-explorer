import { useReducer, useEffect } from 'react';

import Window from './components/Window/Window';
import { Provider } from './context/Context';
import { reducer, init, actions } from './context/stateReducer';
import { getUserHomeFolder } from './data/methods';

import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, {}, init);

  const getHomeDir = () => {
    getUserHomeFolder()
      .then((res) => {
        dispatch(actions.setCurrentPath(res.data.homeFolder));
    })
  };

  useEffect(() => {
    if(state.currentPath.length === 0) {
      getHomeDir();
    }
  }, [state.currentPath]);

  return (
    <Provider
      actions={actions}
      dispatch={dispatch}
      visitedPaths={state.visitedPaths}
      currentPath={state.currentPath}
      currentPosition={state.currentPosition}
      itemId={state.itemId}
    >
      <Window />
    </Provider>
  );
}

export default App;
