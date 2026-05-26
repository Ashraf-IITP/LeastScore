# LeastScore - Agent Instructions

## Dev Commands
- `npm run dev` - Starts custom Express+Socket.io server (not Next.js dev server)
- `npm run build` - Next.js build
- `npm run start` - Production server
- `npm test` - Run Jest tests

## Project Architecture
- **Custom server**: `server.js` wraps Next.js + Express + Socket.io
- **Game logic**: `lib/` contains pure game logic (no HTTP/IO)
- **Pages**: `pages/api/` for endpoints, `pages/` for UI
- **DB**: MySQL via `lib/db.js` (mysql2 promise pool)

## Key Files
| File | Purpose |
|------|---------|
| `server.js` | Express server, Socket.io matchmaking, in-memory game state |
| `lib/game.js` | `initializeGame(playerCount)` - creates game state |
| `lib/hand.js` | `calculateSum(hand)`, `isValidDiscard(hand, cards)` |
| `lib/deck.js` | `createDeck()`, `shuffle(deck)` |
| `lib/turn.js` | Process turn (draw/discard) |
| `lib/round.js` | Declare logic, scoring |
| `lib/auth.js` | JWT verification |
| `lib/db.js` | MySQL connection pool |

## Database
- MySQL required (not SQLite)
- Schema in `database/schema.sql`
- Tables: `users`, `guest_sessions`, `otp_sessions`
- Config via `.env.local` (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)

## Game Rules
- 5 cards dealt to each player + 1 visible card
- Valid discards: 1 card (any), 2 same rank, 3 sequence, 4 same rank, 5 sequence or same suit
- Circular sequences: Q-K-A, A-2-3
- Declare: lowest sum wins, wrong declare = penalty + diff
- Game ends when opponent reaches 100 points

## Testing
- `tests/hand.test.js` - Unit tests for hand logic
- Run with `npm test`

## Notable Quirks
- `.env.local` loaded via `@next/env` in server.js before importing auth/db
- Game state stored in `games` map (roomId -> state)
- Matchmaking queue in `queue` array
- Guest sessions auto-expire via MySQL event + Node timers