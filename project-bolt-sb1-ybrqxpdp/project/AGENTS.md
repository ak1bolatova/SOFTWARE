# AGENTS.md

## Project purpose

Smart Campus room availability checker. A single-page React + TypeScript + Vite
app that lets students check whether a campus room is available for a requested
time interval using fictional booking data and a fixed "current time".

## Hard constraints

- NO login, authentication, or user accounts.
- NO backend, database, or live APIs.
- NO booking creation or saving — data is read-only sample data.
- Do NOT mutate the booking fixtures (`sampleRooms`, `sampleBookings`).
  Treat them as immutable inputs.

## Acceptance criteria (preserve AC1–AC6)

- AC1: Reject `start >= end` and requests whose start is in the past.
- AC2: Reject durations longer than 120 minutes (120 is allowed, 121 is not).
- AC3: A blocked room can never be reported as available.
- AC4: Reject overlapping bookings, but allow intervals that only touch at
  endpoints (`start === existingEnd` or `end === existingStart`).
- AC5: Do not mutate booking data.
- AC6: Preserve clear, responsive UI feedback on desktop and mobile widths.

## Engineering rules

- Prefer pure functions and minimal changes. Do not rewrite the project.
- Keep UI and booking rules separate. The availability logic lives in pure
  modules under `src/lib`; UI lives in `src/components` and `src/App.tsx`.
- Use at most two justified design patterns. A single pure-function module is
  the baseline. Do NOT introduce Singleton, Factory, Strategy, or class
  hierarchies unless justified by a concrete need.
- Use an Adapter only if booking fixtures genuinely have inconsistent data
  formats. They do not today, so do not add one.
- Do not add libraries unless explicitly requested.
- Match existing conventions: Tailwind, `@/` path alias, lucide-react icons.

## Workflow

- Before editing, inspect the relevant files and identify what must change.
- Make the smallest justified refactoring that preserves behavior.
- Run regression tests after each change: `npm run test`, `npm run typecheck`,
  `npm run build`.
- Do not remove or weaken existing tests. Add regression tests for any rule
  that lacks coverage.
- Report changed files and test evidence. Do not claim tests passed unless you
  actually ran them.
