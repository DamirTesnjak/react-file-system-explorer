import { Box } from '@mui/material'

function WindowTitle(props) {
    const { currentPath } = props;

    return (
        <Box>
            {currentPath}
        </Box>
    )
}

export default WindowTitle;