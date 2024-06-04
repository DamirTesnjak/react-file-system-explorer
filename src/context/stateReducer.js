const SET_CURRENT_PATH = 'SET_CURRENT_PATH';
const SET_ITEM_ID = 'SET_ITEM_ID';
const ADD_VISITED_PATH = 'ADD_VISITED_PATH';
const GO_BACK = 'GO_BACK';
const GO_FORWARD = 'GO_FORWARD';

const initialState = {
    currentPath: '',
    itemId: '',
    visitedPaths: [],
    currentPosition: 0,
};

export const init = (state) => ({
  ...initialState,
  ...state,
});

export const reducer = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_CURRENT_PATH:
      return {
        ...state,
        currentPath: action.currentPath,
      };
    case SET_ITEM_ID:
      return {
        ...state,
        itemId: action.itemId,
      };
    case ADD_VISITED_PATH:
      return {
        ...state,
        visitedPaths: [
          ...state.visitedPaths,
          action.visitedPath,
        ],
        currentPosition: state.currentPosition + 1,
      }

      case GO_BACK:
        return {
          ...state,
          currentPosition: state.currentPosition > 0 ? state.currentPosition - 1 : 0,
        };
      case GO_FORWARD:
        return {
          ...state,
          currentPosition: state.currentPosition < state.visitedPaths.length
            ? state.currentPosition + 1
            : state.visitedPaths.length - 1,
        }
    default:
      return state;
  }
};

export const actions = {
  setCurrentPath: (currentPath) => ({ type: SET_CURRENT_PATH, currentPath }),
  setItemId: (itemId) => ({ type: SET_ITEM_ID, itemId }),
  addVisitedPath: (visitedPath) => ({ type: ADD_VISITED_PATH, visitedPath }),
  goBack: () => ({ type: GO_BACK }),
  goFoward: () => ({ type: GO_FORWARD }),
};