import React from 'react';
import { Button, Box } from '@mui/material';

function WindowToolbar(props) {
    const { currentPath, setState, state } = props;

    const btns = [
        { name: "back", method: {
            ...state,
            currentPosition: state.currentPosition > 0 ? state.currentPosition - 1 : 0,
          }},
        { name: "next", method: {
            ...state,
            currentPosition: state.currentPosition < state.visitedPaths.length
                ? state.currentPosition + 1
                : state.visitedPaths.length - 1,
        }},
        { name: "up", method: {
                ...state,
                visitedPaths: [
                  ...state.visitedPaths,
                  () => {
                    const newCurrentPath = currentPath.split('/').pop().join('/');
                    return newCurrentPath;
                  },
                ],
                currentPosition: state.currentPosition + 1,
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