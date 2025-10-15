export const UI_LABELS = {
  APP_TITLE: 'BrightHR - Drive',
  DOCUMENTS: 'Documents',
  TYPE: 'Type',
  NAME: 'Name',
  DATE_ADDED: 'Date added',
  FOLDER: 'Folder',
  FILTER_BY_NAME: 'Filter by name',
  SORT_BY: 'Sort by:',
  SORT_NAME: 'Name',
  SORT_DATE: 'Date',
  HOME: 'Home',
  CLEAR_FILTER: 'clear filter',
  BREADCRUMB_LABEL: 'breadcrumb',
  DOCUMENTS_TABLE_LABEL: 'documents table',
} as const;

export const FILE_TYPE_LABELS = {
  PDF: 'pdf',
  DOC: 'doc',
  CSV: 'csv',
  MOV: 'mov',
  FOLDER: 'folder',
} as const;

export const SORT_OPTIONS = {
  NAME: 'name',
  ADDED: 'added',
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const DEFAULTS = {
  SORT_KEY: SORT_OPTIONS.NAME,
  SORT_DIRECTION: SORT_DIRECTIONS.ASC,
  EMPTY_DATE: '-',
} as const;

export const A11Y_LABELS = {
  CLEAR_FILTER: 'clear filter',
  BREADCRUMB: 'breadcrumb',
  DOCUMENTS_TABLE: 'documents table',
} as const;
