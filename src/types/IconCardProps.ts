import { Path } from "../types/Path";

export interface IconCardProps {
    isFolder?: boolean;
    isFile?: boolean;
    isDisk: boolean;
    name: string;
    itemId: string;
    onClick?: () => void;
    onMouseLeave?: () => void;
    path: Path["path"];
    permission: boolean;
}