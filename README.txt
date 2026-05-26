# Least Score Card Game

A 1v1 card game implementation in Node.js (backend) and Next.js (frontend).

## Game Rules
- Players start with 5 cards each and 1 visible card.
- On turn: Draw 1 card (from visible or deck), discard 1+ cards (valid combinations).
- Valid discards:
  - 1 card: any
  - 2 cards: same rank
  - 3 cards: sequence (e.g., A-2-3, Q-K-A)
  - 4 cards: same rank
  - 5 cards: sequence or same suit
- Declare when you think you have lowest sum; wrong declare = penalty.

## Project Structure
- `lib/types.js`: Constants and types (suits, ranks, values).
- `lib/deck.js`: Deck creation, shuffle, draw.
- `lib/hand.js`: Sum calculation, discard validation.
- `lib/turn.js`: Process draw/discard turn.
- `lib/round.js`: Declare and scoring.
- `lib/game.js`: Game initialization.
- `pages/api/game.js`: API endpoints (new game, turn, declare, state).
- `pages/index.js`: Frontend UI.
- `tests/`: Unit tests.

## How to Run
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:3000
4. Click "New Game" to start.
5. Select cards to discard, choose draw source, click "Make Turn".
6. Click "Declare" when ready.

## Testing
Run tests: `npm test`

## Edge Cases and Test Cases
- **Empty deck**: Shuffles exposed cards when deck empty.
- **Invalid discard**: Rejects non-matching combinations.
- **Declare with higher sum**: Adds penalty + difference.
- **Game end**: When opponent reaches 100 points.
- **Visible card empty**: Prevents draw if no visible.
- **Sequence circular**: Handles Q-K-A and A-2-3.
- **Multiple same rank**: Allows 2,4 of same rank.
- **All face cards**: 4 face cards valid discard.

Test cases cover these in `tests/hand.test.js`.

UPDATE 1.62:
5 sec delay for bots move
Number of Hidden Cards in deck
Drawn cards also to be shown
Don't keep the hidden card pre-selected
Smarter Bots and bug fixes:
Easy Bots:
	Remember all discarded cards to accurately take his chance from hidden deck
	Now avoids discarding smaller for no benefit
	Now declare at a score <7
Hard Bots:
	Now see other opponents as individuals not as a single opponent (Multi-opponent modeling)
	Now considers the likeliness of others to declare
	Removed the humanization mistake mechanism of choosing from hidden deck instead of higher visible card gain
	When opponent has less than 5 cards, it'll not try to avoid throwing favourable suits (since 5 same suit combo not possible)
	Now remembers if you drew 2 consecutive cards in order to avoid giving away a card that can form a combo of 3
	Now only avoids discarding favourable cards to the next in turn opponent and not all the players. But still remembers all the discarded and drawn cards to calculate hand score of others.
	Now remembers count of inhand cards to double check opponents' score estimation.
New User instructions added
Observe a game added
Play along added
Match History Added
Disconnection logic when all disconnects.