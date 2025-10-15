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
import { UI_LABELS, FILE_TYPE_LABELS, SORT_OPTIONS, SORT_DIRECTIONS, DEFAULTS, A11Y_LABELS } from '../constants';

function getIconForFile(file: FileItem) {
	if (file.type === FILE_TYPE_LABELS.PDF) return <PictureAsPdfIcon color="error" />;
	if (file.type === FILE_TYPE_LABELS.DOC) return <ArticleIcon color="primary" />;
	if (file.type === FILE_TYPE_LABELS.CSV) return <TableChartIcon color="success" />;
	if (file.type === FILE_TYPE_LABELS.MOV) return <MovieIcon color="action" />;
	return <DescriptionIcon />;
}

function isFolder(item: Item): item is FolderItem {
	return (item as FolderItem).type === FILE_TYPE_LABELS.FOLDER;
}

function compareBy(a: Item, b: Item, key: SortKey, dir: SortDirection): number {
	const multiplier = dir === SORT_DIRECTIONS.ASC ? 1 : -1;
	if (key === SORT_OPTIONS.NAME) {
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
	const [sortKey, setSortKey] = useState<SortKey>(DEFAULTS.SORT_KEY);
	const [sortDir, setSortDir] = useState<SortDirection>(DEFAULTS.SORT_DIRECTION);

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
		const folders = filtered.filter(isFolder).sort((a, b) => compareBy(a, b, SORT_OPTIONS.NAME, SORT_DIRECTIONS.ASC));
		const files = filtered
			.filter((i) => !isFolder(i))
			.sort((a, b) => compareBy(a, b, sortKey, sortDir));
		return [...folders, ...files];
	}, [currentItems, filter, sortKey, sortDir]);

	const breadcrumbs = useMemo(() => [UI_LABELS.HOME, ...path], [path]);

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
			setSortDir(SORT_DIRECTIONS.ASC);
			return;
		}
		setSortDir((d) => (d === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC));
	};

	return (
		<Box p={4} display="flex" flexDirection="column" gap={3} flex={1}>
			<Box display="flex" alignItems="center" gap={2}>
				<Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
					{UI_LABELS.APP_TITLE}
				</Typography>
			</Box>
			
			<Breadcrumbs 
				aria-label={A11Y_LABELS.BREADCRUMB} 
				sx={{ 
					'& .MuiBreadcrumbs-separator': { 
						color: 'text.secondary' 
					} 
				}}
			>
				{breadcrumbs.map((crumb, idx) => (
					<Link
						key={crumb + idx}
						component="button"
						variant="body2"
						underline="hover"
						onClick={() => handleCrumbClick(idx)}
						sx={{ 
							color: idx === breadcrumbs.length - 1 ? 'text.primary' : 'primary.main',
							fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
							'&:hover': {
								color: 'primary.dark'
							}
						}}
					>
						{crumb}
					</Link>
				))}
			</Breadcrumbs>

			<Box 
				display="flex" 
				gap={3} 
				alignItems="center" 
				flexWrap="wrap"
				sx={{ 
					backgroundColor: 'background.paper',
					p: 3,
					borderRadius: 2,
					boxShadow: 1
				}}
			>
				<TextField
					label={UI_LABELS.FILTER_BY_NAME}
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon color="action" />
							</InputAdornment>
						),
						endAdornment: filter ? (
							<InputAdornment position="end">
								<IconButton 
									aria-label={A11Y_LABELS.CLEAR_FILTER} 
									onClick={() => setFilter('')}
									size="small"
								>
									<ClearIcon fontSize="small" />
								</IconButton>
							</InputAdornment>
						) : undefined,
					}}
					sx={{ 
						maxWidth: 400,
						'& .MuiOutlinedInput-root': {
							borderRadius: 2
						}
					}}
					size="small"
				/>
				<Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
					<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
						{UI_LABELS.SORT_BY}
					</Typography>
					<Chip
						label={UI_LABELS.SORT_NAME}
						color={sortKey === SORT_OPTIONS.NAME ? 'primary' : 'default'}
						onClick={() => toggleSort(SORT_OPTIONS.NAME)}
						icon={sortKey === SORT_OPTIONS.NAME ? (sortDir === SORT_DIRECTIONS.ASC ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : undefined}
						variant={sortKey === SORT_OPTIONS.NAME ? 'filled' : 'outlined'}
						size="small"
						sx={{ 
							'&:hover': { 
								backgroundColor: sortKey === SORT_OPTIONS.NAME ? 'primary.dark' : 'action.hover' 
							}
						}}
					/>
					<Chip
						label={UI_LABELS.SORT_DATE}
						color={sortKey === SORT_OPTIONS.ADDED ? 'primary' : 'default'}
						onClick={() => toggleSort(SORT_OPTIONS.ADDED)}
						icon={sortKey === SORT_OPTIONS.ADDED ? (sortDir === SORT_DIRECTIONS.ASC ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : undefined}
						variant={sortKey === SORT_OPTIONS.ADDED ? 'filled' : 'outlined'}
						size="small"
						sx={{ 
							'&:hover': { 
								backgroundColor: sortKey === SORT_OPTIONS.ADDED ? 'primary.dark' : 'action.hover' 
							}
						}}
					/>
				</Box>
			</Box>

			<TableContainer 
				component={Paper} 
				variant="outlined"
				sx={{ 
					borderRadius: 2,
					overflow: 'hidden',
					'& .MuiTable-root': {
						'& .MuiTableCell-root': {
							borderBottom: '1px solid',
							borderBottomColor: 'divider',
						}
					}
				}}
			>
				<Table aria-label={A11Y_LABELS.DOCUMENTS_TABLE}>
					<caption style={{ display: 'none' }}>{UI_LABELS.DOCUMENTS}</caption>
					<TableHead>
						<TableRow>
							<TableCell scope="col" sx={{ fontWeight: 600, color: 'text.primary' }}>{UI_LABELS.TYPE}</TableCell>
							<TableCell
								scope="col"
								sx={{ fontWeight: 600, color: 'text.primary' }}
								aria-sort={sortKey === SORT_OPTIONS.NAME ? (sortDir === SORT_DIRECTIONS.ASC ? 'ascending' : 'descending') : 'none'}
							>
								{UI_LABELS.NAME}
							</TableCell>
							<TableCell
								scope="col"
								sx={{ fontWeight: 600, color: 'text.primary' }}
								aria-sort={sortKey === SORT_OPTIONS.ADDED ? (sortDir === SORT_DIRECTIONS.ASC ? 'ascending' : 'descending') : 'none'}
							>
								{UI_LABELS.DATE_ADDED}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{visibleItems.map((item) => {
							if (isFolder(item)) {
								return (
									<TableRow 
										key={`folder-${item.name}`} 
										hover 
										sx={{ 
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: 'action.hover'
											}
										}} 
										role="button"
										tabIndex={0}
										aria-label={`Open folder ${item.name}`}
										onClick={() => handleOpenFolder(item)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												handleOpenFolder(item);
											}
										}}
									>
										<TableCell width={80}>
											<FolderIcon sx={{ color: 'warning.main', fontSize: 24 }} />
										</TableCell>
										<TableCell>
											<Typography fontWeight={600} sx={{ color: 'text.primary' }}>
												{item.name}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{UI_LABELS.FOLDER}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2" color="text.secondary">{DEFAULTS.EMPTY_DATE}</Typography>
										</TableCell>
									</TableRow>
								);
							}
							const file = item as FileItem;
							return (
								<TableRow 
									key={`file-${file.name}`}
									hover
									sx={{ 
										'&:hover': {
											backgroundColor: 'action.hover'
										}
									}}
								>
									<TableCell width={80}>{getIconForFile(file)}</TableCell>
									<TableCell>
										<Typography sx={{ color: 'text.primary' }}>
											{file.name}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{file.added}
										</Typography>
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


