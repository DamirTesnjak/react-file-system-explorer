import React from 'react';
import { Button, Box } from '@mui/material';

import { useContextApp } from '../../context/Context';

function WindowToolbar() {
    const {
        dispatch,
        actions,
        currentPath,
    } = useContextApp();

    const btns = [
        { name: "back", method: dispatch(actions.goBack()) },
        { name: "next", method: dispatch(actions.goFoward()) },
        { name: "up", method: () => {
            dispatch(actions.goFoward());
            dispatch(actions.addVisitedPath(currentPath.split('\\').pop().join('\\'))); 
        }}
    ]

    const displayButtons = () => {
        const btnToDisplay = btns.map((button) => {
            return (<Button
                        variant='outlined'
                        onClick={() => button.method}
                    >
                        {button.name}
                    </Button>);
        })
        return btnToDisplay;
    };
    return (
        <Box>
            {displayButtons}
        </Box>
    );
}

export default WindowToolbar;