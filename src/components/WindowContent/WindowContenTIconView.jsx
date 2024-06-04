import React, {useState, useEffect, useCallback} from 'react';
import { v4 } from 'uuid';
import { Grid, IconButton, Box } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { getFolder, openFile } from '../../data/methods';

function IconCard(props) {
    const { type, name, itemId, onClick } = props

    const displayIcon = () => {
        if (type === 'folder') {
            return (
                <IconButton
                    color="highlight"
                    size='large'
                >
                    <FolderIcon />
                </IconButton>
            );
        }
        return (
            <IconButton
                color="highlight"
            >
                <InsertDriveFileIcon />
            </IconButton>
        );
    };

    return (
        <Grid
            id={itemId}
            item 
            xs={2}
            key={itemId}
            sx={{margin: '10px'}}
            onClick={onClick}
        >
            <Grid item>
                {displayIcon()}
            </Grid>
            <Grid item>
                {name}
            </Grid>
        </Grid>
    )
}

function WindowContentIconView(props) {
    const [folderData, setFolderData] = useState()
    const {
        visitedPaths,
        currentPosition,
        currentPath,
        itemId,
        state,
        setState,
    } = props;

    const getFolderContentCallBack = useCallback(() => {
        getFolder({ folderPath: visitedPaths[currentPosition]})
        .then((res) => {
            setFolderData(res.data.folderContent);
        });
    }, [currentPath]);

    const getFolderContent = (path) => {
        getFolder({ folderPath: path })
        .then((res) => {
            setFolderData(res.data.folderContent);
            setState({
                ...state,
                visitedPaths: [
                  ...state.visitedPaths,
                  path,
                ],
                currentPosition: state.currentPosition + 1,
                currentPath: path,
              })
        });
    };

    useEffect(() => getFolderContentCallBack, [getFolderContentCallBack, visitedPaths])

    const openSelectedFile = (path) => {
        openFile({ path:path })
        .then((res) => {
            console.log(res);
        });
    }


    const displayItemsAsIcons = () => {
        if (itemId === 'computer') {
            if (folderData && folderData.length > 0) {
                const items = folderData.map((diskItem) => {
                    return <IconCard
                        type="folder"
                        itemId={v4()}
                        name={diskItem.filesystem + " " + diskItem.mounted}
                        path={diskItem.mounted + "/"}
                        onClick={() => getFolderContent(diskItem.mounted + "/")}
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
                    return "folder";
                }
                const items = folderData.map((itemList) => {
                    return (<IconCard
                        type={setType(itemList)}
                        itemId={v4()}
                        name={itemList.name}
                        path={itemList.path} 
                        itemCount={itemList.itemCount}
                        onClick={() => setType(itemList) === 'file' ? openSelectedFile(itemList.path) : getFolderContent(itemList.path)}
                    />)
                });
                return items;
            }
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2 }}>
                {displayItemsAsIcons()}
            </Grid>
        </Box>
    )
}
export default WindowContentIconView;