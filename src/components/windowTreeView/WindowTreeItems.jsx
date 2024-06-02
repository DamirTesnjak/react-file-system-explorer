import React, { useState, useEffect } from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { v4 } from 'uuid';

import { getFolder, openFile } from '../../data/methods';

const windowTreeItems = (folderData, itemId) => {
    if (itemId === 'computer') {
        console.log('test');
        if (folderData && folderData.length > 0) {
            const items = folderData.map((diskItem) => {
                return <WindowTreeItems
                    type="folder"
                    itemId={v4()}
                    name={diskItem.filesystem + " " + diskItem.mounted}
                    path={diskItem.mounted + "/"}
                />
            });
            return items;
        }
    } else {
        if (folderData && folderData.length > 0) {
            const items = folderData.map((itemList) => {
                return (<WindowTreeItems
                    type={itemList.name.includes('.') ? 'file' : 'folder'}
                    itemId={v4()}
                    name={itemList.name}
                    path={itemList.path} 
                />)
            });
            return items;
        }
    }
}

function WindowTreeItems(props) {
    const {
        itemId,
        treeViewData,
        type,
        name,
        path
    } = props;
    const [folderData, setFolderData] = useState(treeViewData);

    const getFolderContent = () => {
        getFolder({ folderPath: path })
        .then((res) => {
            console.log('res', res);
            setFolderData(res.data.folderContent)
        });
    }

    const openSelectedFile = () => {
        openFile({ path:path })
        .then((res) => {
            console.log(res);
        });
    }

    useEffect(() => {}, [folderData])

    return (
        <TreeItem
            itemId={itemId}
            label={name}
            onClick={() => type === 'file' ? openSelectedFile() : getFolderContent()}
        >
            {windowTreeItems(folderData && folderData.length > 0 ? folderData : treeViewData, itemId)}
        </TreeItem>
    );
}

export default WindowTreeItems;