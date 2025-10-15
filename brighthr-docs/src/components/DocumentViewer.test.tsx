import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AppThemeProvider } from '../theme';
import { DocumentViewer } from './DocumentViewer';
import { ROOT_ITEMS } from '../data';

function renderWithProviders(ui: React.ReactElement) {
	return render(<AppThemeProvider>{ui}</AppThemeProvider>);
}

describe('DocumentViewer', () => {
	it('renders root documents and folders', () => {
		renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
		expect(screen.getByText('Documents')).toBeInTheDocument();
		expect(screen.getByText('Employee Handbook')).toBeInTheDocument();
		expect(screen.getByText('Expenses')).toBeInTheDocument();
	});

	it('navigates into a folder on click', async () => {
		const user = userEvent.setup();
		renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
		await user.click(screen.getByText('Expenses'));
		expect(screen.getByText('Expenses claim form')).toBeInTheDocument();
		expect(screen.getByText('Fuel allowances')).toBeInTheDocument();
	});

	it('filters by filename', async () => {
		const user = userEvent.setup();
		renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
		await user.type(screen.getByLabelText('Filter by name'), 'employee');
		expect(screen.getByText('Employee Handbook')).toBeInTheDocument();
		expect(screen.queryByText('Public Holiday policy')).not.toBeInTheDocument();
	});
});


