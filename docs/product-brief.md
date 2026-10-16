# Movie-night — product brief

Status: working brief. The original MVP rules have been selected; practical constraints and the walkthrough still need review.

## Problem

This app comes from my own experience with movie nights. My friends and I often get stuck choosing what to watch. Nobody wants responsibility for picking a bad movie and being blamed for it. The discussion can last longer than a movie, and sometimes we abandon the night entirely.

## Solution and audience

Movie-night gives groups of friends a shared nomination board and a voting process, distributing responsibility for the choice. A host organizes each night and controls its phases. Invited participants join using an invite code. The host also participates under the same nomination and voting limits.

## Core journey and first-release features

Sign in → create or join a night → nominate a movie → vote → view the result.

- Users register, sign in and sign out of accounts belonging to this app.
- A host creates a night and shares an invite code. Only signed-in members can view its board or participate.
- During nomination, each member may suggest at most one movie using TMDB search. Duplicate movies are rejected; rejection does not use an unused nomination allowance or create a vote.
- The host opens voting once at least one nomination exists. Membership and nominations then freeze.
- Each member has one vote, changeable until voting closes. Self-voting and abstaining are allowed; nomination is optional.
- The host closes voting. A unique highest-voted movie wins. A tie awaits the host's selection from the tied leaders. Zero votes means no winner.
- Closed nights remain viewable. Members refresh manually to see updates.

Detailed behavior and remaining decisions are recorded in [rules.md](rules.md).

## Excluded from the first release

Chat, personalized recommendations, streaming integrations, automatic deadlines, live updates and reopening closed nights are outside the first release. Nomination editing, withdrawal and membership removal are not included in the current draft; review those policies before implementation.

## Success measure

Proposed target: five friends can create/join a night, nominate, vote and reach a final result without assistance. User feedback should also establish whether it reduces discussion and frustration around choosing a movie.

## Practical constraints

- Stack: HTML, CSS, vanilla JavaScript, Node.js/Express and PostgreSQL.
- TMDB supplies movie metadata and posters; its credential stays on the server, and the app must include the required attribution.
- Proposed device scope: mobile and desktop browsers, with keyboard-accessible controls and readable forms.
- Available time, hosting budget, exact supported browsers and release target: to be decided.
- No user interviews or successful three-person walkthrough have been recorded yet.
