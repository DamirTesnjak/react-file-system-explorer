import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import { getHardDrives } from '../../data/methods';
import WindowTreeItems from './WindowTreeItems';

function WindowTreeView() {
    const [disksData, setFdisksDatata] = useState([]);

    const getFolderContent = () => {
        getHardDrives()
            .then((res) => {
                setFdisksDatata(res.data.hardDrives)
            });
    }

    useEffect(() => {
        if (disksData.length === 0) {
            getFolderContent()
        }
    }, [disksData])

    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <SimpleTreeView>
                <WindowTreeItems 
                    treeViewData={disksData}
                    itemId="computer"
                    name="computer"
                />
            </SimpleTreeView>
        </Box>
    );
}

export default WindowTreeView;