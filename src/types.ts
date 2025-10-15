export type FileType = 'pdf' | 'doc' | 'csv' | 'mov';

export interface BaseItem {
	name: string;
}

export interface FileItem extends BaseItem {
	type: FileType;
	added: string; // ISO date string
}

export interface FolderItem extends BaseItem {
	type: 'folder';
	files: Array<FileItem | FolderItem>;
}

export type Item = FileItem | FolderItem;

export type SortKey = 'name' | 'added';
export type SortDirection = 'asc' | 'desc';

