import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import type { PropsWithChildren } from 'react';

const theme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: '#1976d2',
					light: '#42a5f5',
					dark: '#1565c0',
				},
				background: {
					default: '#f8fafc',
					paper: '#ffffff',
				},
				grey: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				},
			},
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h5: {
			fontWeight: 700,
			fontSize: '1.5rem',
		},
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					backgroundColor: '#f8fafc',
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: '#f8fafc',
					},
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontWeight: 500,
				},
			},
		},
	},
});

export function AppThemeProvider({ children }: PropsWithChildren) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}


