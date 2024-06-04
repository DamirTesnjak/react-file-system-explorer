import { baseRpcUrl } from './axios/baseUrl';

const baseURL = `${baseRpcUrl}`;

const copyFileUrl = `${baseURL}/copyFile`;
const copyFolderUrl = `${baseURL}/copyFolder`;
const createFolderUrl = `${baseURL}/createFolder`;
const deleteFolderUrl = `${baseURL}/deleteFolder`;
const moveFileUrl = `${baseURL}/moveFile`;
const moveFolderUrl = `${baseURL}/moveFolder`;
const removeFileUrl = `${baseURL}/removeFile`;
const renameUrl = `${baseURL}/rename`;
const getFolderUrl = `${baseURL}/getFolder`;
const openFileUrl = `${baseURL}/openFile`;
const getHardDrivesUrl = `${baseURL}/getHardDrives`;
const getUserHomeFolderUrl = `${baseURL}/getUserHomeFolder`;

export {
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
};
