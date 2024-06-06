import React from 'react';
import { Button, Box } from '@mui/material';

function WindowToolbar(props) {
    const { currentPath, setState, state } = props;

    const parentPath = () => {
        const currentPathArray = currentPath?.split('/');
        currentPathArray?.splice(currentPathArray.length - 1, 1);

        const parentPath = currentPathArray?.join('/');
        if (parentPath) {
            return parentPath;
        }
    }

    const btnBackCurrentPositionCondition = state.currentPosition > 0 ? state.currentPosition - 1 : 0;
    const btnBackCurrentPathCondition = state.visitedPaths[state.currentPosition > 0 ? state.currentPosition - 1 : 0];

    const btnNextCondition = state.currentPosition < state.visitedPaths.length - 1
    ? state.currentPosition + 1
    : state.visitedPaths.length - 1;

    const btns = [
        { name: "back", method: {
            ...state,
            visitedPaths: [...state.visitedPaths, btnBackCurrentPathCondition],
            currentPosition: btnBackCurrentPositionCondition,
            currentPath: btnBackCurrentPathCondition,
          }},
        { name: "next", method: {
            ...state,
            currentPosition: btnNextCondition,
            currentPath: state.visitedPaths[btnNextCondition],
        }},
        { name: "up", method: {
                ...state,
                visitedPaths: [...state.visitedPaths, parentPath()],
                currentPath: parentPath(),
                currentPosition: state.visitedPaths.length,
            }}
        ]

    const displayButtons = () => {
        const btnToDisplay = btns.map((button) => {
            return (<Button
                        variant='outlined'
                        onClick={() => setState(button.method)}
                    >
                        {button.name}
                    </Button>);
        })
        return btnToDisplay;
    };
    return (
        <Box>
            {displayButtons()}
        </Box>
    );
}

export default WindowToolbar;