import React, {
    createContext,
    useContext,
} from 'react';
import { noop } from 'lodash';

const Context = createContext({
    dispatch: noop,
    currentPath: '',
    itemId: '',
    visitedPaths: [],
    currentPosition: 0,
});

export function Provider({ children, ...rest }) {
  return (
    <Context.Provider value={rest}>
      {children}
    </Context.Provider>
  );
}

export const useContextApp = () => {
  const {
    dispatch,
    actions,
    currentPath,
    itemId,
    visitedPaths,
    currentPosition
  } = useContext(Context);

  return {
    dispatch,
    actions,
    currentPath,
    visitedPaths,
    currentPosition,
    itemId,
  };
};
