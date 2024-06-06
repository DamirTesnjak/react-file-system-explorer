import { useState, useEffect } from 'react';
import { Box } from '@mui/material'

function WindowTitle(props) {
    const { currentPath } = props;

    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState('');
    const [selectedPathTreeView, setSelectedPathTreeView] = useState('');

    useEffect(() => {
        function storageEventHandler(event){
            const value = JSON.parse(event.detail.value);
            if(event.detail.key === 'treeViewValues') {
                setSelectedTreeViewItem(value.selectTreeViewItem);
                setSelectedPathTreeView(value.selectedPathTreeView);
            }
        }
        window.addEventListener("localStorageChange", storageEventHandler);
        return () => {
            // Remove the handler when the component unmounts
            window.removeEventListener("localStorageChange", storageEventHandler);
        };
    }, []);

    return (
        <Box>
            {selectedTreeViewItem ? selectedPathTreeView : currentPath}
        </Box>
    )
}

export default WindowTitle;