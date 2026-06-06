# Pentax Medical - Project Overview

## 1. Project Description
Pentax is a Mongolian-language desktop application for endoscopy clinics built with Electron + React. It manages patient examinations including data entry, image/video capture from endoscopy devices, PDF report generation, and data storage.

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 31 |
| Bundler | electron-vite (Vite 5) |
| Frontend | React 18 + React Router v7 (HashRouter) |
| Styling | Tailwind CSS 3 + CSS variables (shadcn/ui pattern) |
| Database | better-sqlite3 (SQLite with WAL mode) |
| Auth | bcrypt + jsonwebtoken (JWT in localStorage) |
| Forms | react-hook-form |
| Table | @tanstack/react-table |
| Drag & drop | @dnd-kit/core |
| Rich text | Jodit React (summary/notes) |
| Date handling | date-fns |
| Video/FFmpeg | ffmpeg-static |
| Icons | react-icons (Rx icons) |
| UI primitives | Radix UI (dialog, dropdown, select, slider, scroll-area, etc.) |
| Toast | sonner |
| Slider/wizard | swiper |
| Animation | lottie-react |
| UUID | uuid |
| Logging | electron-log |
| Packaging | electron-builder (Windows NSIS, macOS DMG, Linux AppImage) |
| Lint/Format | ESLint + Prettier |

## 3. Architecture (Electron 3-Process Model)

```
src/
├── main/           # Main (Node) process - privilege
│   ├── index.js    # Entry: window creation, IPC handlers, app lifecycle
│   ├── config/     # Database, logging, password hashing, JWT
│   │   ├── database.js   # SQLite connection, table init, migrations
│   │   ├── log.js        # electron-log setup
│   │   ├── password.js   # bcrypt hash/compare
│   │   └── token.js      # JWT sign/verify
│   └── services/   # Business logic + IPC handlers (9 files)
│       ├── auth.js       # Login, register, token check
│       ├── user.js       # CRUD users, profile, passwords
│       ├── employee.js   # CRUD employees/patients + image management
│       ├── hospital.js   # Hospital info CRUD
│       ├── address.js    # City/district address CRUD
│       ├── options.js    # Inspection/scope/procedure options
│       ├── system.js     # Data directory config
│       ├── file.js       # File I/O, video/image capture, FFmpeg
│       └── menu.js       # Native Electron menu
├── preload/        # Bridge between main & renderer
│   ├── index.js    # contextBridge exposing APIs to renderer
│   └── routes/     # ipcRenderer wrappers (9 files matching services)
│       ├── auth.js, users.js, employee.js, hospital.js, address.js,
│       ├── options.js, system.js, file.js, dataConfig.js
└── renderer/       # React UI (process)
    ├── index.html
    └── src/
        ├── main.jsx          # React entry
        ├── App.jsx           # HashRouter + provider nesting
        ├── assets/           # CSS, fonts, images, SVGs, Lottie animations
        ├── context/          # React Context providers (7)
        │   ├── auth-context.jsx        # JWT auth state
        │   ├── page-router.jsx         # Custom page routing (not react-router page routes)
        │   ├── new-data-context.jsx    # Tab management + form state
        │   ├── users-context.jsx, hospital-context.jsx,
        │   ├── address-context.jsx, options-context.jsx
        ├── lib/              # Utilities
        │   ├── utils.js      # cn() helper, age calculator
        │   └── staticData.js # Default slot positions for endoscopy images
        ├── pages/            # Page-level components (8)
        │   ├── Loader.jsx, GetStarted.jsx, Login.jsx,
        │   ├── Main.jsx, RootConfig.jsx, Settings.jsx, page.jsx
        ├── components/       # Reusable components
        │   ├── layouts/      # main-layout.jsx, admin-layout.jsx
        │   ├── main/         # DetailTab, EditDetailForm, NewTab, PrintPage
        │   │   └── new-tab/  # GeneralInformation, MediaInformation (multi-step form)
        │   ├── ui/           # 21 shadcn-style components (Button, Input, Dialog, etc.)
        │   ├── video/        # Video recording/capture integration
        │   ├── dnd/          # Drag-and-drop image organizer
        │   └── ...           # settings, profile, worker, address modals
```

## 4. Database Schema (SQLite, better-sqlite3)

6 tables + 1 migration table:

- **users** — Auth & user management (systemRole: admin/worker/root, role: nurse/etc.)
- **hospital** — Single hospital record (name, dept, address, phone)
- **employee** — Patient examination records (the core entity)
- **employeeImages** — Images linked to an employee (raw camera captures + selected report images)
- **address** — Hierarchical locations (cities parent -> districts child)
- **optionsData** — Dropdown option values (inspectionType, scopeType, procedureType)
- **data_config** — Singleton config row (directory path, device, status)
- **data_migrate** — Schema migration tracking

## 5. IPC Communication Pattern

All renderer-to-main communication uses `ipcRenderer.invoke` / `ipcMain.handle` (promise-based). Preload exposes `window.api` with wrapper functions. Naming convention: `domain:action` (e.g., `auth:login`, `employee:create`, `file:saveImage`).

For window control (minimize/maximize/close), `ipcRenderer.send` (fire-and-forget) is used.

The preload also exposes `@electron-toolkit/preload` as `window.electron`.

## 6. Key Features

1. **Authentication** — JWT-based login, token in localStorage, role-based access (admin/worker/system-root)
2. **Wizard-style patient registration** — Step 1: general info form -> Step 2: media capture
3. **Endoscopy device integration** — Video/image capture from connected cameras, FFmpeg conversion
4. **Image management** — Raw image capture auto-slotted into anatomical positions, drag-and-drop reordering
5. **PDF report generation** — Uses Electron `printToPDF`, rendered via React component (`PrintPage`)
6. **Tab-based navigation** — Main list tab, detail tabs, new-examination tabs with persistence in localStorage
7. **Settings panel** — Profile, Hospital, Inspection settings, Workers, Address, Data storage config
8. **Data recovery** — Recovery mechanism for images when DB and filesystem get out of sync
9. **Printing** — Direct physical printing or PDF preview
10. **Native menu** — Electron app menu with keyboard shortcuts (Alt+P/H/D/M/C/I/W)

## 7. Critical Code Patterns

- **No TypeScript** — All JS files use `.js`/`.jsx` extensions
- **CSS approach** — Tailwind utility classes + CSS variables for theming; no CSS modules except one (`style.module.css`, `index.module.css`)
- **Context providers** — All state is managed via React Context (no Redux/Zustand)
- **Tabs** — Tab state persisted in `localStorage('tabs')`; new examination draft in `localStorage('newData')`
- **Error handling** — All service functions wrapped in try/catch returning `{ result: boolean, message?: string, data?: any }`
- **Image slots** — `staticData.js` defines 9 lower-GI positions and 11 upper-GI positions
- **Database path** — `./pentax_store.db` in dev, `app.getPath('userData')` in production
- **Token secret** — Hardcoded `'PENTAX_PASSWORD_SECRET'` in `token.js`

## 8. Build & Dev Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev with hot-reload |
| `npm run build` | Build for current platform |
| `npm run build:win` | Build Windows installer (NSIS) |
| `npm run build:mac` | Build macOS DMG |
| `npm run build:linux` | Build Linux AppImage/snap/deb |
| `npm run lint` | ESLint check + fix |
| `npm run format` | Prettier format |
| `npm run rebuild` | Rebuild native modules (better-sqlite3) |
| `npm run build:unpack` | Build unpacked directory (for testing) |

## 9. Noteworthy Observations

- **No tests** — No test framework configured (no jest, vitest, playwright, etc.)
- **No dark mode toggle** — Dark theme CSS variables defined but no toggle mechanism
- **CSP** — Content Security Policy set in `index.html` allows `'unsafe-inline'` for styles
- **`webSecurity: false`** — Disabled in main window (allows `file:` protocol for images)
- **Frame: false** — Custom window frame (no native title bar)
- **`electron-builder.yml`** — Publishes to GitHub releases, bundles the SQLite database as extra resource
- **Mongolian UI** — All labels, messages, and error text are in Mongolian (Cyrillic)
