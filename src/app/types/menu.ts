
export interface MenuItem {
    label: string;
    icon?: React.ReactNode;
    path?: string;
    subItems?: { label: string; path: string }[];
}