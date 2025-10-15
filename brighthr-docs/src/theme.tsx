import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import type { PropsWithChildren } from 'react';

const theme = createTheme({
	colorSchemes: {
		light: true,
	},
	typography: {
		fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
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


