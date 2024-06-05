import React, { useState, useEffect, useCallback } from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { v4 } from 'uuid';

import { getFolder, openFile } from '../../data/methods';

const windowTreeItems = ({
    folderData,
    itemId,
    state,
    setState,
}) => {
    if (itemId === 'computer') {
        if (folderData && folderData.length > 0) {
            const items = folderData.map((diskItem) => {
                return <WindowTreeItems
                    type="folder"
                    itemId={v4()}
                    name={diskItem.filesystem + " " + diskItem.mounted}
                    path={diskItem.mounted + "/"}
                    state={state}
                    setState={setState}
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
                    state={state}
                    setState={setState}
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
        path,
        state,
        setState,
    } = props;
    const [folderData, setFolderData] = useState(treeViewData);

    const getFolderContent = useCallback(() => {
        getFolder({ folderPath: path })
        .then((res) => {
            setFolderData(res.data.folderContent)
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
            getFolderContent();
        }
    }, [folderData, getFolderContent])

    return (
        <TreeItem
            itemId={itemId}
            label={name}
            onClick={() => type === 'file'
                ? openSelectedFile()
                : setState({
                    ...state,
                    visitedPaths: [...state.visitedPaths, path],
                    currentPath: path,
                    currentPosition: state.visitedPaths.length,
            })}
        >
            {windowTreeItems({
                folderData: folderData && folderData.length > 0 ? folderData : treeViewData,
                itemId,
                state,
                setState,
            })}
        </TreeItem>
    );
}

export default WindowTreeItems;