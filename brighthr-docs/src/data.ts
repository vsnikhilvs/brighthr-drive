import  type { Item } from './types';
import { FILE_TYPE_LABELS } from './constants';

export const ROOT_ITEMS: Item[] = [
	{
		type: FILE_TYPE_LABELS.PDF,
		name: 'Employee Handbook',
		added: '2017-01-06',
	},
	{
		type: FILE_TYPE_LABELS.PDF,
		name: 'Public Holiday policy',
		added: '2016-12-06',
	},
	{
		type: FILE_TYPE_LABELS.FOLDER,
		name: 'Expenses',
		files: [
			{
				type: FILE_TYPE_LABELS.DOC,
				name: 'Expenses claim form',
				added: '2017-05-02',
			},
			{
				type: FILE_TYPE_LABELS.DOC,
				name: 'Fuel allowances',
				added: '2017-05-03',
			},
		],
	},
	{
		type: FILE_TYPE_LABELS.CSV,
		name: 'Cost centres',
		added: '2016-08-12',
	},
	{
		type: FILE_TYPE_LABELS.FOLDER,
		name: 'Misc',
		files: [
			{
				type: FILE_TYPE_LABELS.DOC,
				name: 'Christmas party',
				added: '2017-12-02',
			},
			{
				type: FILE_TYPE_LABELS.MOV,
				name: 'Welcome to the company!',
				added: '2015-04-24',
			},
		],
	},
];


