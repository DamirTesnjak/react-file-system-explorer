import React, { useState, useEffect, useCallback } from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { v4 } from 'uuid';

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
        state,
        setState,
    } = props;
    const [folderData, setFolderData] = useState(treeViewData);
    console.log('folderData', folderData);

    const getFolderContent = useCallback(() => {
        getFolder({ folderPath: path })
            .then((res) => {
                setFolderData(res.data.folderContent);
                setState({
                    ...state,
                    visitedPaths: [...state.visitedPaths, path],
                    currentPath: path,
                    currentPosition: state.visitedPaths.length,
                })
            });
    }, [path, setState, state]);

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
            });;
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
                state,
                setState,
            })}
        </TreeItem>
    );
}

export default WindowTreeItems;