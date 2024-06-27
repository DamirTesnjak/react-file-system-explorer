export interface FolderData {
    type?: string;
    name: string;
    parentPath?: string;
    path: string;
    size?: string;
    itemCounts?: string;
    permission: boolean;
    isFolder: boolean;
    isFile: boolean;
  }