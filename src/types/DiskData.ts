export interface DiskData {
    permission: boolean;
    filesystem: string;
    blocks: number;
    used: number;
    available: number;
    capacity: number;
    mounted: number;
    path: string;
    isDisk: boolean;
    name: string;
    isFile: false;
    isFolder: false;
  }