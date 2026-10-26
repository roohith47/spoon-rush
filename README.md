# Spoon Rush

**[Play the public beta](https://spoon-rush-rohith.savory-tetra-4471.chatgpt.site)** · **[Report a bug](https://github.com/roohith47/spoon-rush/issues/new/choose)**

A multiplayer Spoons game built with ChatGPT Work for the Handshake AI Skills Studio challenge. Collect four matching ranks, quietly grab a spoon, and avoid being the last player empty-handed.

## Play

1. Open the game, choose a nickname, and create a table.
2. Share the invite link with friends on separate devices. Start with 3–6 players.
3. The dealer starts with three cards and draws; everyone else starts with four.
4. Tap the face-down pile on your left to inspect a card. Pass one unwanted card right.
5. The last player's discards are shuffled into the dealer's next draw pile when needed.
6. Four matching ranks lets you take the first spoon. Once a spoon is gone, anyone can grab.
7. The player without a spoon is eliminated. Continue to a winner, then rematch.

Inspecting a card dims the spoons, but keeps them tappable. Incoming cards stack face down with a count badge and arrival animation. Dealer draws use a paced, face-down animation before revealing the rank.

## Public playtest

Try the game with friends and report clear reproduction steps, device/browser, player count, and screenshots. Particularly useful tests: repeated taps, cards arriving while inspecting, simultaneous spoon grabs, refreshing, losing connection, deck recycling, and playing to a winner.

Use test nicknames. Test only rooms you and your friends create; don't disrupt other players or flood the hosted service.

### Known beta limitations

- State synchronizes by polling every 500 ms, rather than WebSockets. Network speed can affect reaction races; grabs are settled by successful server update order.
- Refreshing in the same tab restores your seat. A device's browser storage identifies its player; use separate devices or browser profiles for different players.
- There is no host transfer or automatic removal of disconnected seats yet. A player leaving mid-round can stall card circulation; start a fresh room for now.
- This is a small playtest build, not a load-tested or security-audited service. Room expiry and stronger abuse controls are still to come.
- The GitHub repository is a source snapshot. GitHub changes do not automatically deploy to the live site.

## Source and hosting

React + TypeScript with Vinext, a Cloudflare Worker API, and D1 persistence. The server validates moves, keeps opponents' cards private, and uses optimistic concurrency to serialize room changes.

The live beta is hosted by ChatGPT Sites. **GitHub Pages cannot run this app's server or database.** This repository contains the source and reproducible setup; independent hosting requires a Cloudflare Worker plus a D1 binding named `DB`.

## Run locally

Requires Node 22.13+ and pnpm 10. No production credentials are included.

```bash
pnpm install --frozen-lockfile
pnpm run db:generate  # only when changing the schema; the initial migration is already committed
pnpm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_motionless_mathemanic.sql
pnpm run dev
```

Apply the migration once per fresh local database. Use the preview URL printed by the development server. Local preview simulates D1; it does not access production rooms.

```bash
pnpm exec tsc --noEmit
node tests/game.test.mjs
```

Core source: `app/page.tsx` (UI), `app/components/IncomingPile.tsx` (arrivals), `lib/game.ts` (rules), `app/api/game/route.ts` (room API), and `db/schema.ts` + `drizzle/` (storage).
