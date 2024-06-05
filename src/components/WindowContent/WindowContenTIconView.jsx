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
                        width: '100px'
                    }}>
                    <span>{name}</span>
                </Typography>
            </Paper>
        </Grid>
    )
}

function WindowContentIconView(props) {
    const [folderData, setFolderData] = useState()
    const [disksData, setFdisksDatata] = useState([]);
    const {
        visitedPaths,
        currentPosition,
        state,
        setState,
    } = props;

    const getFolderContentCallBack = useCallback(() => {
        getFolder({ folderPath: visitedPaths[currentPosition]})
        .then((res) => {
            setFolderData(res.data.folderContent);
        });
    }, [currentPosition, visitedPaths]);

    const getHardDrivesFolderContent = () => {
        getHardDrives()
            .then((res) => {
                setFdisksDatata(res.data.hardDrives)
            });
    }

    useEffect(() => {
        if (disksData.length === 0 && state.currentPath === 'Computer') {
            getHardDrivesFolderContent()
        }
    }, [disksData.length, state.currentPath])

    useEffect(() => getFolderContentCallBack(), [getFolderContentCallBack])

    const openSelectedFile = (path) => {
        openFile({ path:path })
        .then((res) => {
            console.log(res);
        });
    }


    const displayItemsAsIcons = () => {
        if (state.currentPath === 'Computer') {
            if (disksData && disksData.length > 0) {
                const items = disksData.map((diskItem) => {
                    return <IconCard
                        type="hardDrive"
                        itemId={v4()}
                        name={diskItem.filesystem + " " + diskItem.mounted}
                        path={diskItem.mounted + "/"}
                        onClick={() => setState({
                            ...state,
                            visitedPaths: [...state.visitedPaths, diskItem.mounted + "/"],
                            currentPath: diskItem.mounted + "/",
                            currentPosition: state.visitedPaths.length,
                        })}
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
                        onClick={() => setType(itemList) === 'file' 
                            ? openSelectedFile(itemList.path)
                            : setState({
                                ...state,
                                visitedPaths: [...state.visitedPaths, itemList.path],
                                currentPath: itemList.path,
                                currentPosition: state.visitedPaths.length,
                            })}
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