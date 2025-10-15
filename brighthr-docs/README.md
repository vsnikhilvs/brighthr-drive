## BrightHR Documents Viewer

Single-page app built with React + TypeScript + Vite and MUI.

Features:
- View folders and files with type, name, date added
- Open folders to see contents
- Sort by name or date (files), toggle asc/desc
- Filter by filename
- Component tests with Vitest + Testing Library

Scripts:
- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview production build
- `npm run test` – run tests once
- `npm run test:watch` – run tests in watch mode

Implementation notes:
- Data lives in `src/data.ts`. Types are in `src/types.ts`.
- Main component: `src/components/DocumentViewer.tsx`.
- MUI theme provider in `src/theme.tsx`; wired in `src/main.tsx`.
