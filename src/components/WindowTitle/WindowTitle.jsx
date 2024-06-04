import { Box } from '@mui/material'
import { useContextApp } from '../../context/Context';

function WindowTitle() {
    const { visitedPaths, currentPosition } = useContextApp();

    return (
        <Box>
            {visitedPaths[currentPosition]}
        </Box>
    )
}

export default WindowTitle;