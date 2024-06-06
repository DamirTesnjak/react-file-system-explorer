import React, { useState, useEffect, useCallback } from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { uniq } from 'lodash';

import { getFolder, openFile } from '../../data/methods';

const windowTreeItems = (args) => {
    const {
        folderData,
        itemId,
        state,
        setState,
    } = args;
    if (itemId === 'computer') {
        if (folderData && folderData.length > 0) {
            const items = folderData.map((diskItem) => {
                return <WindowTreeItems
                    type="folder"
                    itemId={diskItem.mounted + "/"}
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
                return (
                <WindowTreeItems
                    type={setType(itemList)}
                    itemId={itemList.path}
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
                const duplicates = [...state.expandedItems ].filter((e) => e === itemId ).length;
                const filteredExpandedItems = [...state.expandedItems ].filter((e) => e !== itemId )
                console.log('duplicates', duplicates);
                setFolderData(res.data.folderContent);
                setState({
                    ...state,
                    itemId,
                    expandedItems: duplicates > 0 ? uniq(filteredExpandedItems) : [...state.expandedItems, itemId],
                    currentPath: path,
                    visitedPaths: [...state.visitedPaths, path],
                })
            });
    }, [itemId, path, setState, state]);

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
    }, [folderData, itemId, path, setState, state]);

    const expandItemList = () => {
        console.log('itemId', itemId);
        getFolderContent();
    }

    return (
        <TreeItem
            itemId={itemId}
            label={name}
            sx={{ backgroundColor: type === 'file' ? '#e6e6e6' : '#f2f2f2'}}
            onClick={() => type === 'file'
                ? openSelectedFile()
                : expandItemList()}
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