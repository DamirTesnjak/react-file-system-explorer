import { Box } from '@mui/material'

function WindowTitle(props) {
    const { currentPath } = props;
    console.log('props', props);

    return (
        <Box>
            {currentPath}
        </Box>
    )
}

export default WindowTitle;