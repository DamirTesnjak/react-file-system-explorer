import React, { useState, useEffect, useCallback } from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { v4 } from 'uuid';

import { getFolder, openFile } from '../../data/methods';

const windowTreeItems = (args) => {
    const {
        folderData,
        itemId,
    } = args;
    if (itemId === 'computer') {
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
            const setType = (itemList) => {
                if(itemList.name.includes('$')) {
                    return 'folder';
                }
                if(itemList.name.includes('.')) {
                    return 'file';
                }
            }
            const items = folderData.map((itemList) => {
                return (<WindowTreeItems
                    type={setType(itemList)}
                    itemId={v4()}
                    name={itemList.name}
                    path={itemList.path} 
                    itemCount={itemList.itemCount}
                />)
            });
            console.log(items)
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
        path,
    } = props;
    const [folderData, setFolderData] = useState(treeViewData);

    const getFolderContent = useCallback(() => {
        getFolder({ folderPath: path })
            .then((res) => {
                setFolderData(res.data.folderContent);
            });
    }, [path]);

    const openSelectedFile = () => {
        openFile({ path:path })
        .then((res) => {
            console.log(res);
        });
    }

    useEffect(() => {
        if (!folderData) {
            getFolder({ folderPath: path })
            .then((res) => {
                setFolderData(res.data.folderContent);
            });
        }
    }, [folderData, getFolderContent, path]);

    const expandItemList = () => {
        getFolderContent();
    }

    return (
        <TreeItem
            itemId={itemId}
            label={name}
            onClick={() => type === 'file'
                ? openSelectedFile()
                : expandItemList()}
        >
            {windowTreeItems({
                folderData: folderData && folderData.length > 0 ? folderData : treeViewData,
                itemId,
            })}
        </TreeItem>
    );
}

export default WindowTreeItems;