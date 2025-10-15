import { useMemo, useState } from 'react';
import {
	Box,
	Breadcrumbs,
	Chip,
	IconButton,
	InputAdornment,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import TableChartIcon from '@mui/icons-material/TableChart';
import MovieIcon from '@mui/icons-material/Movie';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import type { Item, FolderItem, FileItem, SortDirection, SortKey } from '../types';

function getIconForFile(file: FileItem) {
	if (file.type === 'pdf') return <PictureAsPdfIcon color="error" />;
	if (file.type === 'doc') return <ArticleIcon color="primary" />;
	if (file.type === 'csv') return <TableChartIcon color="success" />;
	if (file.type === 'mov') return <MovieIcon color="action" />;
	return <DescriptionIcon />;
}

function isFolder(item: Item): item is FolderItem {
	return (item as FolderItem).type === 'folder';
}

function compareBy(a: Item, b: Item, key: SortKey, dir: SortDirection): number {
	const multiplier = dir === 'asc' ? 1 : -1;
	if (key === 'name') {
		return a.name.localeCompare(b.name) * multiplier;
	}
	// Files have dates, folders do not; folders should group first before sorting by name
	const aDate = (a as FileItem).added ?? '';
	const bDate = (b as FileItem).added ?? '';
	return aDate.localeCompare(bDate) * multiplier;
}

export function DocumentViewer({ rootItems }: { rootItems: Item[] }) {
	const [path, setPath] = useState<string[]>([]);
	const [filter, setFilter] = useState('');
	const [sortKey, setSortKey] = useState<SortKey>('name');
	const [sortDir, setSortDir] = useState<SortDirection>('asc');

	const currentItems = useMemo<Item[]>(() => {
		let items: Item[] = rootItems;
		for (const segment of path) {
			const next = items.find((i) => isFolder(i) && i.name === segment) as FolderItem | undefined;
			items = next ? next.files : [];
		}
		return items;
	}, [rootItems, path]);

	const visibleItems = useMemo<Item[]>(() => {
		const normalizedFilter = filter.trim().toLowerCase();
		const filtered = normalizedFilter
			? currentItems.filter((i) => i.name.toLowerCase().includes(normalizedFilter))
			: currentItems;
		// group folders first, then files, each individually sorted
		const folders = filtered.filter(isFolder).sort((a, b) => compareBy(a, b, 'name', 'asc'));
		const files = filtered
			.filter((i) => !isFolder(i))
			.sort((a, b) => compareBy(a, b, sortKey, sortDir));
		return [...folders, ...files];
	}, [currentItems, filter, sortKey, sortDir]);

	const breadcrumbs = useMemo(() => ['Home', ...path], [path]);

	const handleOpenFolder = (folder: FolderItem) => {
		setPath((prev) => [...prev, folder.name]);
	};

	const handleCrumbClick = (index: number) => {
		if (index === 0) {
			setPath([]);
			return;
		}
		setPath(path.slice(0, index));
	};

	const toggleSort = (key: SortKey) => {
		if (sortKey !== key) {
			setSortKey(key);
			setSortDir('asc');
			return;
		}
		setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
	};

	return (
		<Box p={3} display="flex" flexDirection="column" gap={2} flex={1}>
			<Typography variant="h5" fontWeight={600}>
				BrightHR - Drive
			</Typography>
			<Breadcrumbs aria-label="breadcrumb">
				{breadcrumbs.map((crumb, idx) => (
					<Link
						key={crumb + idx}
						component="button"
						variant="body2"
						underline="hover"
						onClick={() => handleCrumbClick(idx)}
					>
						{crumb}
					</Link>
				))}
			</Breadcrumbs>

			<Box display="flex" gap={2} alignItems="center">
				<TextField
					label="Filter by name"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
						endAdornment: filter ? (
							<InputAdornment position="end">
								<IconButton aria-label="clear filter" onClick={() => setFilter('')}>
									<ClearIcon />
								</IconButton>
							</InputAdornment>
						) : undefined,
					}}
					sx={{ maxWidth: 360 }}
				/>
				<Box display="flex" gap={1} alignItems="center">
					<Typography variant="body2">Sort by:</Typography>
					<Chip
						label="Name"
						color={sortKey === 'name' ? 'primary' : 'default'}
						onClick={() => toggleSort('name')}
						icon={sortKey === 'name' ? (sortDir === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : undefined}
						variant={sortKey === 'name' ? 'filled' : 'outlined'}
					/>
					<Chip
						label="Date"
						color={sortKey === 'added' ? 'primary' : 'default'}
						onClick={() => toggleSort('added')}
						icon={sortKey === 'added' ? (sortDir === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : undefined}
						variant={sortKey === 'added' ? 'filled' : 'outlined'}
					/>
				</Box>
			</Box>

			<TableContainer component={Paper} variant="outlined">
				<Table size="small" aria-label="documents table">
					<TableHead>
						<TableRow>
							<TableCell>Type</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Date added</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{visibleItems.map((item) => {
							if (isFolder(item)) {
								return (
									<TableRow key={`folder-${item.name}`} hover sx={{ cursor: 'pointer' }} onClick={() => handleOpenFolder(item)}>
										<TableCell width={80}>
											<FolderIcon color="warning" />
										</TableCell>
										<TableCell>
											<Typography fontWeight={600}>{item.name}</Typography>
											<Typography variant="caption" color="text.secondary">
												Folder
											</Typography>
										</TableCell>
										<TableCell>-</TableCell>
									</TableRow>
								);
							}
							const file = item as FileItem;
							return (
								<TableRow key={`file-${file.name}`}>
									<TableCell width={80}>{getIconForFile(file)}</TableCell>
									<TableCell>
										<Typography>{file.name}</Typography>
									</TableCell>
									<TableCell>
										<Typography>{file.added}</Typography>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

export default DocumentViewer;


