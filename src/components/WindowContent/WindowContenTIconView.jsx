import React, {useState, useEffect, useCallback} from 'react';
import { v4 } from 'uuid';
import { 
    Grid,
    IconButton,
    Box,
    Paper,
    Typography
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import Album from '@mui/icons-material/Album';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { Icon } from '@fluentui/react/lib/Icon';

import { getFolder, openFile } from '../../data/methods';
import { getHardDrives } from '../../data/methods';

function IconCard(props) {
    const { type, name, itemId, onClick } = props

    const displayIcon = () => {
        if (type === 'folder') {
            return (
                <IconButton disableRipple>
                    <FolderIcon sx={{ fontSize: 64, color: 'orange'}}/>
                </IconButton>
            );
        }
        if (type === 'file') {
            return (
                <IconButton disableRipple>
                    <Icon {...getFileTypeIconProps({ extension: name.split('.')[1], size: 64 })} />
                </IconButton>
            );
        }
        return (
            <IconButton
                color="highlight"
                disableRipple
            >
                {name.includes('CD-ROM') 
                    ? <Album sx={{ fontSize: 64, color: 'grey'}}/>
                    : <StorageOutlinedIcon sx={{ fontSize: 64, color: 'grey'}}/>
                }
            </IconButton>
        );
    };

    return (
        <Grid
            id={itemId}
            item 
            xs={2}
            key={itemId}
            sx={{margin: '10px', cursor: 'pointer'}}
            onClick={onClick}
        >
            <Paper elevation={2}>
                {displayIcon()}
                <Typography
                    variant="subtitle2"
                    component="span"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                    }}>
                    <span>{name}</span>
                </Typography>
            </Paper>
        </Grid>
    )
}

function WindowContentIconView(props) {
    const [folderData, setFolderData] = useState()
    const [selectedTreeViewItem, setSelectedTreeViewItem] = useState('');
    const [selectedPathTreeView, setSelectedPathTreeView] = useState('');
    const [disksData, setFdisksDatata] = useState([]);
    const {
        visitedPaths,
        currentPosition,
        state,
        setState,
    } = props;

    const getFolderContentCallBack = useCallback(() => {
        getFolder({ folderPath: selectedTreeViewItem ? selectedPathTreeView : visitedPaths[currentPosition]})
        .then((res) => {
            setFolderData(res.data.folderContent);
        });
    }, [currentPosition, selectedPathTreeView, selectedTreeViewItem, visitedPaths]);

    const getHardDrivesFolderContent = () => {
        getHardDrives()
            .then((res) => {
                setFdisksDatata(res.data.hardDrives)
            });
    }

    useEffect(() => {
        function storageEventHandler(event){
            const value = JSON.parse(event.detail.value);
            if(event.detail.key === 'treeViewValues' && value.selectTreeViewItem) {
                setSelectedTreeViewItem(value.selectTreeViewItem);
                setSelectedPathTreeView(value.selectedPathTreeView);
            }
        }
        window.addEventListener("localStorageChange", storageEventHandler);
        return () => {
            // Remove the handler when the component unmounts
            window.removeEventListener("localStorageChange", storageEventHandler);
        };
    }, [])

    useEffect(() => {
        if (disksData.length === 0 && state.currentPath === 'Computer') {
            getHardDrivesFolderContent();
        }
    }, [disksData.length, state.currentPath])

    useEffect(() => getFolderContentCallBack(), [getFolderContentCallBack])

    const openSelectedFile = (path) => {
        openFile({ path:path })
        .then((res) => {
            console.log(res);
            setSelectedTreeViewItem(false);
        });
    }

    const updateLocalStorageValues = (newState, path) => {
        const value = JSON.stringify({ 
            ...newState,
            selectedPathTreeView: path,
            selectTreeViewItem: false,
        })
        localStorage.setItem('treeViewValues', value);
        // Dispatch a custom event
        window.dispatchEvent(
            new CustomEvent(
                'localStorageChange', {
                    detail: { 
                        key: 'treeViewValues', value
                    }
                }
            )
        );
    }


    const displayItemsAsIcons = () => {
        if (state.currentPath === 'Computer') {
            if (disksData && disksData.length > 0) {
                const items = disksData.map((diskItem) => {
                    const newState = {
                        ...state,
                        visitedPaths: [...state.visitedPaths, diskItem.mounted + "/"],
                        currentPath: diskItem.mounted + "/",
                        currentPosition: state.visitedPaths.length,
                    };
                    const setValues = () => {
                        setState(newState);
                        setSelectedTreeViewItem(false);
                        updateLocalStorageValues(newState, diskItem.mounted + "/");     
                    }

                    return <IconCard
                        type="hardDrive"
                        itemId={v4()}
                        name={diskItem.filesystem + " " + diskItem.mounted}
                        path={diskItem.mounted + "/"}
                        onClick={() => setValues()}
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
                    const newState = {
                        ...state,
                        visitedPaths: [...state.visitedPaths, itemList.path],
                        currentPath: itemList.path,
                        currentPosition: state.visitedPaths.length,
                    }
                    const setValues = () => {
                        setState(newState);
                        setSelectedTreeViewItem(false);
                        updateLocalStorageValues(itemList.path);
                    }
                    return (<IconCard
                        type={setType(itemList)}
                        itemId={v4()}
                        name={itemList.name}
                        path={itemList.path} 
                        itemCount={itemList.itemCount}
                        onClick={() => setType(itemList) === 'file' 
                            ? openSelectedFile(itemList.path)
                            : setValues()}
                    />)
                });
                return items;
            }
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                {displayItemsAsIcons()}
            </Grid>
        </Box>
    )
}
export default WindowContentIconView;