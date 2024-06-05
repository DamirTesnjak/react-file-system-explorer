import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import { getHardDrives } from '../../data/methods';
import WindowTreeItems from './WindowTreeItems';

function WindowTreeView(props) {
    const {
        state,
        setState,
    } = props;

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
            <SimpleTreeView
                slots={{
                    expandIcon: AddBoxIcon,
                    collapseIcon: IndeterminateCheckBoxIcon,
                }}>
                <WindowTreeItems 
                    treeViewData={disksData}
                    itemId="computer"
                    name="computer"
                    path='Computer'
                    onClick={() => setState({
                        ...state,
                        visitedPaths: [...state.visitedPaths, "Computer"],
                        currentPath: "Computer",
                        currentPosition: state.visitedPaths.length,
                    })}
                />
            </SimpleTreeView>
        </Box>
    );
}

export default WindowTreeView;