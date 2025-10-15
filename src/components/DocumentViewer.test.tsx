import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { AppThemeProvider } from "../theme";
import { DocumentViewer } from "./DocumentViewer";
import { ROOT_ITEMS } from "../data";
import { UI_LABELS } from "../constants";

function renderWithProviders(ui: React.ReactElement) {
    return render(<AppThemeProvider>{ui}</AppThemeProvider>);
}

describe("DocumentViewer", () => {
    it("renders root documents and folders", () => {
        renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
        expect(screen.getByText(UI_LABELS.APP_TITLE)).toBeInTheDocument();
        expect(screen.getByText("Employee Handbook")).toBeInTheDocument();
        expect(screen.getByText("Expenses")).toBeInTheDocument();
    });

    it("navigates into a folder on click", async () => {
        const user = userEvent.setup();
        renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
        await user.click(screen.getByText("Expenses"));
        expect(screen.getByText("Expenses claim form")).toBeInTheDocument();
        expect(screen.getByText("Fuel allowances")).toBeInTheDocument();
    });

    it("filters by filename", async () => {
        const user = userEvent.setup();
        renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
        await user.type(
            screen.getByLabelText(UI_LABELS.FILTER_BY_NAME),
            "employee"
        );
        expect(screen.getByText("Employee Handbook")).toBeInTheDocument();
        expect(
            screen.queryByText("Public Holiday policy")
        ).not.toBeInTheDocument();
    });

     it("sorts files by name when clicking name sort chip", async () => {
         const user = userEvent.setup();
         renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
         const initialTableRows = screen.getAllByRole("row");
         const initialFileRows = initialTableRows.slice(1);
         const initialFileNames = initialFileRows
             .map((row) => {
                 const nameCell = row.querySelector("td:nth-child(2)");
                 const folderLabel = row.querySelector(
                     "td:nth-child(2) .MuiTypography-caption"
                 );
                 return folderLabel ? null : nameCell?.textContent?.trim();
             })
             .filter(Boolean);
         await user.click(
             screen.getByRole("button", { name: UI_LABELS.SORT_NAME })
         );
         
         const tableRows = screen.getAllByRole("row");
         const fileRows = tableRows.slice(1);
         const fileNames = fileRows
             .map((row) => {
                 const nameCell = row.querySelector("td:nth-child(2)");
                 const folderLabel = row.querySelector(
                     "td:nth-child(2) .MuiTypography-caption"
                 );
                 return folderLabel ? null : nameCell?.textContent?.trim();
             })
             .filter(Boolean);
         const expectedDescending = [...initialFileNames].reverse();
         expect(fileNames).toEqual(expectedDescending);
     });

    it("sorts files by date when clicking date sort chip", async () => {
        const user = userEvent.setup();
        renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
        await user.click(
            screen.getByRole("button", { name: UI_LABELS.SORT_DATE })
        );
        const tableRows = screen.getAllByRole("row");
        const fileRows = tableRows.slice(1);
        const fileDates = fileRows
            .map((row) => {
                const folderLabel = row.querySelector(
                    "td:nth-child(2) .MuiTypography-caption"
                );
                const dateCell = row.querySelector("td:nth-child(3)");
                return folderLabel ? null : dateCell?.textContent?.trim();
            })
            .filter(Boolean);
        const sortedDates = [...fileDates].sort();
        expect(fileDates).toEqual(sortedDates);
    });

     it("toggles sort direction when clicking the same sort chip twice", async () => {
         const user = userEvent.setup();
         renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
         const initialTableRows = screen.getAllByRole("row");
         const initialFileRows = initialTableRows.slice(1);
         const initialFileNames = initialFileRows
             .map((row) => {
                 const nameCell = row.querySelector("td:nth-child(2)");
                 const folderLabel = row.querySelector(
                     "td:nth-child(2) .MuiTypography-caption"
                 );
                 return folderLabel ? null : nameCell?.textContent?.trim();
             })
             .filter(Boolean);
         await user.click(
             screen.getByRole("button", { name: UI_LABELS.SORT_NAME })
         );
         
         const tableRows = screen.getAllByRole("row");
         const fileRows = tableRows.slice(1);
         const fileNames = fileRows
             .map((row) => {
                 const nameCell = row.querySelector("td:nth-child(2)");
                 const folderLabel = row.querySelector(
                     "td:nth-child(2) .MuiTypography-caption"
                 );
                 return folderLabel ? null : nameCell?.textContent?.trim();
             })
             .filter(Boolean);
         const expectedDescending = [...initialFileNames].reverse();
         expect(fileNames).toEqual(expectedDescending);
         await user.click(
             screen.getByRole("button", { name: UI_LABELS.SORT_NAME })
         );

         const tableRowsAfter = screen.getAllByRole("row");
         const fileRowsAfter = tableRowsAfter.slice(1);
         const fileNamesAfter = fileRowsAfter
             .map((row) => {
                 const nameCell = row.querySelector("td:nth-child(2)");
                 const folderLabel = row.querySelector(
                     "td:nth-child(2) .MuiTypography-caption"
                 );
                 return folderLabel ? null : nameCell?.textContent?.trim();
             })
             .filter(Boolean);
         expect(fileNamesAfter).toEqual(initialFileNames);
     });

     it("shows correct sort indicators in table headers", async () => {
         const user = userEvent.setup();
         renderWithProviders(<DocumentViewer rootItems={ROOT_ITEMS} />);
         const nameHeader = screen.getByRole("columnheader", {
             name: UI_LABELS.NAME,
         });
         const dateHeader = screen.getByRole("columnheader", {
             name: UI_LABELS.DATE_ADDED,
         });
         expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
         expect(dateHeader).toHaveAttribute("aria-sort", "none");
         await user.click(screen.getByRole("button", { name: UI_LABELS.SORT_NAME }));
         expect(nameHeader).toHaveAttribute("aria-sort", "descending");
         expect(dateHeader).toHaveAttribute("aria-sort", "none");
         await user.click(screen.getByRole("button", { name: UI_LABELS.SORT_NAME }));
         expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
         expect(dateHeader).toHaveAttribute("aria-sort", "none");
         await user.click(screen.getByRole("button", { name: UI_LABELS.SORT_DATE }));
         expect(nameHeader).toHaveAttribute("aria-sort", "none");
         expect(dateHeader).toHaveAttribute("aria-sort", "ascending");
     });
});
