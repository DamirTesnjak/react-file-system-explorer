import axiosInstance from './axios/axios';

import {
    copyFileUrl,
    copyFolderUrl,
    createFolderUrl,
    deleteFolderUrl,
    moveFileUrl,
    moveFolderUrl,
    removeFileUrl,
    renameUrl,
    getFolderUrl,
    openFileUrl,
    getHardDrivesUrl,
    getUserHomeFolderUrl,
} from './endpoints';

export const copyFile = (request = {}) => axiosInstance
  .post(copyFileUrl, request);



export const copyFolder = (request = {}) => axiosInstance
    .post(copyFolderUrl, request);

export const createFolder = (request = {}) => axiosInstance
    .post(createFolderUrl, request);

export const deleteFolder = (request = {}) => axiosInstance
    .post(deleteFolderUrl, request);

export const moveFile = (request = {}) => axiosInstance
    .post(moveFileUrl, request);

export const moveFolder = (request = {}) => axiosInstance
    .post(moveFolderUrl, request);

export const removeFile = (request = {}) => axiosInstance
    .post(removeFileUrl, request);

export const rename = (request = {}) => axiosInstance
    .post(renameUrl, request);

export const getFolder = (request = {}) => axiosInstance
    .post(getFolderUrl, request);

export const openFile = (request = {}) => axiosInstance
    .post(openFileUrl, request);

export const getHardDrives = (request = {}) => axiosInstance
    .post(getHardDrivesUrl, request);

export const getUserHomeFolder = (request = {}) => axiosInstance
    .post(getUserHomeFolderUrl, request);
