import React from 'react';
import { Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material//ArrowForward';
import ArrowBackIcon from '@mui/icons-material//ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material//ArrowUpward';

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
            icon: <ArrowBackIcon />,
          }},
        { name: "next", method: {
            ...state,
            currentPosition: btnNextCondition,
            currentPath: state.visitedPaths[btnNextCondition],
            icon: <ArrowForwardIcon />
        }},
        { name: "up", method: {
                ...state,
                visitedPaths: [...state.visitedPaths, parentPath()],
                currentPath: parentPath(),
                currentPosition: state.visitedPaths.length,
                icon: <ArrowUpwardIcon />,
            }}
        ]

    const displayButtons = () => {
        const btnToDisplay = btns.map((button) => {
            return (<Button
                        variant='outlined'
                        startIcon={button.icon}
                        onClick={() => setState(button.method)}
                    >
                        {button.name}
                    </Button>);
        })
        return btnToDisplay;
    };
    return (
        <Box sx={{ backgroundColor: '#f2f2f2'}}>
            {displayButtons()}
        </Box>
    );
}

export default WindowToolbar;