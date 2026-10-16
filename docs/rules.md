# Movie-night — business rules

Status: working specification using the original MVP rules selected by the project owner. Additional draft policies are labeled below. Review the walkthrough and open decisions before implementation.

## Roles and access

A visitor is not signed in. A nonmember is signed in but does not belong to this night. A member belongs to it. The host created the night and is also a member; host status is specific to a night, not an account type.

Only members can view the board, nominations, voting information or results. Knowing a night ID or invite code does not grant access without joining. Accounts belong to this app; users do not need TMDB accounts.

## Permissions

| Action | Visitor | Signed-in nonmember | Member | Host |
|---|---|---|---|---|
| Register or sign in | Yes | Already signed in | Already signed in | Already signed in |
| Create a night | No | Yes | Yes | Yes |
| Join using a valid invite | No | Nominating only | Already a member; no duplicate membership | Already a member |
| View board and result | No | No | All phases | All phases |
| Search movies for nomination | No | No | Nominating only | Nominating only |
| Submit a nomination | No | No | Nominating; no existing nomination | Same member limit |
| Cast or change a vote | No | No | Voting only | Same member limit |
| Start voting | No | No | No | Nominating; at least one nomination |
| Close voting | No | No | No | Voting; repeated close returns saved outcome |
| Resolve a tie | No | No | No | Closed with pending tie; tied leader only |

Leaving, removing members, transferring ownership, deleting nights and editing nominations have no first-release action in this draft. Searching never permits a second nomination.

## Lifecycle and participation

Every night follows **nominating → voting → closed**. Only the host advances phases; no automatic deadline or reopening is included.

### Nominating

- Creating a night also creates the host's membership in the same operation.
- Signed-in friends join with a valid invite code. Rejoining cannot create a second membership; existing members can access their night in any phase.
- Each member may nominate at most one movie per night. Nomination is optional; members who skip it may still vote.
- The same TMDB movie may appear only once per night. A duplicate is rejected without consuming an unused nomination allowance or casting a vote.
- Movie details come from TMDB through the server. Failed details requests do not save nominations; missing posters use a placeholder.
- Proposed draft policy: confirmed nominations cannot be replaced or withdrawn.
- The host can start voting only with at least one nomination. Starting freezes membership and nominations, even if some members have not nominated.

### Voting

- Each member has at most one active vote per night, targeting a nomination from that same night.
- Changing a vote replaces the old choice; it does not add another vote.
- Self-voting and abstaining are allowed. Vote withdrawal is not included in the current draft.
- New membership and nomination changes are blocked.
- The host may close before everyone votes. Every accepted vote must be counted; votes after closing are rejected.
- Visibility of running totals remains undecided.

### Closed

| Frozen totals | Saved outcome | Remaining host action |
|---|---|---|
| Zero votes | No winner | None |
| One highest-voted movie | Winner | None |
| Tied highest positive total | Pending tiebreak | Choose one tied leader |

- Zero votes is not a tie, even with several nominations.
- Joining, nominations and votes stay frozen while a tie awaits selection.
- The host may select only a tied leader. A finalized winner cannot change.
- Repeating close returns the saved outcome without recomputing it. Repeating the same successful tiebreak returns the saved result; choosing a different winner afterward is rejected.
- Members can still view final totals and results. A pending tie remains unresolved if the host does not act.

## Acceptance criteria

These are observable requirements, not implemented tests.

| User story | Completion check |
|---|---|
| As a user, I want an account to participate. | Registration/login identify the correct account; logout or expired login prevents authenticated actions until login. |
| As a host, I want to create a night and invite friends. | Creation records the host as a member; another signed-in user can join during nomination. Invalid invites create no membership. |
| As a member, I want a private board. | Members can read it; visitors and nonmembers cannot access it through direct URLs or API requests. |
| As a member, I want to suggest a movie. | A nomination persists after refresh. Second nominations and duplicate movies are rejected with feedback, preserving existing data. Concurrent submissions cannot bypass either limit. |
| As a host, I want to open voting. | An empty board blocks opening. With a nomination, opening freezes joins/nominations. Nonhosts cannot open voting. |
| As a member, I want to cast or change a vote. | The target belongs to this night; changing leaves one active vote. Votes outside Voting are rejected. |
| As a host, I want a consistent result. | Closing counts all committed accepted votes and blocks later votes. A vote racing with closing is accepted and counted or rejected. Nonhosts cannot close. |
| As a member, I want to understand the result. | Closing shows a unique winner, no winner for zero votes, or a pending tie with tied leaders and frozen totals. |
| As a host, I want to resolve a tie. | Selecting a tied leader records the winner. Selecting a nonleader or changing a finalized winner is rejected. |
| As a member, I want useful failure feedback. | Failed TMDB requests create no partial nominations. Missing posters do not block saved movies. Expired login requires signing in again without automatically resubmitting a write. |

## Three-person walkthrough to review

This proposed scenario is not evidence of a completed walkthrough.

1. Alex creates a night and becomes host/member. Sam and Noor sign in and join using its invite code.
2. Alex nominates Alien. Sam attempts Alien and is rejected; Sam still has no nomination or vote and can choose another movie.
3. Sam nominates Arrival; Noor nominates Spirited Away. Each person has one nomination and no vote.
4. Alex opens voting. Joining and nominations freeze; a late friend cannot join.
5. Alex and Sam vote for Spirited Away; Noor votes for Arrival. Totals are 0–1–2. Alex closes and Spirited Away wins.
6. In a separate night, repeat with one vote for each movie. Closing produces a frozen 1–1–1 tie. Alex chooses one tied leader; no further votes are allowed.
7. In another separate night, nobody votes. Closing records no winner; Alex cannot arbitrarily choose one.
8. Try a vote after closing and a close request from Sam. Both fail without changing the outcome.

## Decisions still to settle

- Show running vote totals or hide them until closing?
- Confirm the draft policy of no nomination replacement/withdrawal and no vote withdrawal.
- Confirm no leaving, member removal or host transfer, and that an absent host leaves progress pending in the first release.
- Define account/night deletion and historical-data retention before finalizing the schema.
- Specify input limits, invite-code handling, session expiry and stable errors in the later API/security documents.

Related drafts: [product brief](product-brief.md), [user flow](USER_FLOW.md), [lifecycle](STATE_DIAGRAM.md), [data model](ERD.md) and [critical interactions](SEQUENCE_DIAGRAMS.md).
