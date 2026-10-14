# Contact Table and Board Prototype

React + TypeScript + Vite + Tailwind. Mock data, local state, no backend.

Run: npm install, npm run dev

## Design choices
- One shared contacts state for Table and Board, so edits in one view update the other with no duplicate or stale records.
- Table for scanning fields, Board for scanning by Stage. Details panel shared by both views for Stage and Notes edits.
- Save commits the change and moves the card, Cancel discards it. Closing the panel returns to the same view.
- Empty group shown so the Board always shows all four stages. Missing Email, Company, Role, or Notes shown as a clear empty state.

## Trade-offs
- Local state only, no persistence. Refresh resets edits, which keeps scope to the core flow.
- No drag-and-drop. Stage change via the details panel is more reliable for keyboard and narrow layouts.
- Kept search and filters out to stay within the core flow.

## What I would improve next
- Persist edits to localStorage, add drag-and-drop between board groups with keyboard support, and add filters by Owner, Labels, and Stage.
