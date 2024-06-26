import React from 'react';
import { IconButton } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import Album from "@mui/icons-material/Album";
import { getFileTypeIconProps } from "@fluentui/react-file-type-icons";
import { Icon } from "@fluentui/react/lib/Icon";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ComputerIcon from '@mui/icons-material/Computer';

import { COMPUTER } from "../constants/constants";

const displayIcon = (args) => {
    const {
        permission,
        isFolder,
        isFile,
        isDisk,
        name,
        itemId,
        currentPath,
    } = args;
    if (itemId === COMPUTER) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <ComputerIcon sx={{ fontSize: !itemId ? 64 : 32, color: "#0066ff" }} />
        </IconButton>
      );
    }
    if (!permission && (itemId || currentPath) !== COMPUTER) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <QuestionMarkIcon sx={{ fontSize: !itemId ? 64 : 32, color: "#e6e6e6" }} />
        </IconButton>
      );
    }
    if (isFile && !isDisk) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <Icon
            {...getFileTypeIconProps({
              extension: name?.split(".")[1],
              size: !itemId ? 64 : 32,
            })}
          />
        </IconButton>
      );
    }
    if (isFolder && !isDisk) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <FolderIcon sx={{ fontSize: !itemId ? 64 : 32, color: "orange" }} />
        </IconButton>
      );
    }
    if (!isFolder && !isDisk) {
      return (
        <IconButton disableRipple sx={{ display: "inline-block" }}>
          <Icon
            {...getFileTypeIconProps({
              extension: name?.split(".")[1],
              size: itemId ? 64 : 32,
            })}
          />
        </IconButton>
      );
    }
    return (
      <IconButton color="highlight" disableRipple>
        {name.includes("CD-ROM") ? (
          <Album sx={{ fontSize: !itemId ? 64 : 32, color: "grey" }} />
        ) : (
          <StorageOutlinedIcon sx={{ fontSize: !itemId ? 64 : 32, color: "grey" }} />
        )}
      </IconButton>
    );
  };

  export default displayIcon;