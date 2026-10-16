# Movie-night negotiator: compact roadmap

For the professional preparation phase before implementation, follow [PREPARATION.md](PREPARATION.md).

Build a shared board where friends sign in, suggest movies, and vote for what to watch—like a suggestion board and ballot box at a gathering.

## Stack

- **Frontend:** HTML, CSS, vanilla JavaScript and Fetch; Express serves the frontend and API together. Start with manual refresh.
- **Backend:** Node.js LTS + Express; TMDB requests go through your server, with its token in an environment variable. Your users have accounts in your app; they do not need TMDB accounts. [TMDB authentication](https://developer.themoviedb.org/docs/authentication-application)
- **Database:** PostgreSQL + `pg`, plain SQL and versioned migrations. Use parameterized queries. [pg documentation](https://node-postgres.com/features/queries)
- **Login:** Argon2id password hashes; `express-session` with PostgreSQL session storage and secure cookies in deployed environments. [Express sessions](https://expressjs.com/en/resources/middleware/session/)
- **Workflow:** Git/GitHub, Node test runner + Supertest, Playwright for the main user journey, GitHub Actions; managed Node hosting and PostgreSQL.

## MVP rules

Suggested defaults for the rules you have not specified:

- A host creates a night; signed-in friends join using an invite code. Only members can view or participate.
- Phases: **nominating → voting → closed**, advanced by the host. Freeze membership and nominations when voting begins.
- Each member may nominate **at most one movie per night**. Reject duplicate TMDB movies within that night.
- Each member has one vote per night, changeable until closing; voting for your own movie is allowed.
- When the host closes voting, the highest total wins. A tie requires the host to select from the tied leaders; zero votes means no winner. Closed nights cannot be edited.

Example result: `Friday night | Alien: 3 votes | Arrival: 2 votes | winner: Alien`.

## Build in order

| Step | Build and learn | Done when |
|---|---|---|
| 1. Plan | Sketch login, nights list, board and result screens; define the rules. | You can walk through a complete night on paper. |
| 2. Foundation | Set up Git, Express, PostgreSQL and migrations. Tables: users, movie_nights, night_members, nominations, votes. | A local request reads a database record. |
| 3. Accounts and nights | Registration/login/logout, host ownership, create/join nights, membership checks. | Two accounts share a night; a nonmember is blocked. |
| 4. Movie board | Search TMDB, select a result, fetch trusted movie details; save TMDB ID, title, year, overview and poster path. Handle loading, missing posters and API failures. | A nomination remains visible after refresh. |
| 5. Voting and results | Enforce one nomination and one vote using SQL uniqueness on `(night_id, user_id)`; unique movies on `(night_id, tmdb_movie_id)`. Ensure each vote targets a nomination from the same night. Coordinate voting and closing in database transactions. | Repeated/concurrent requests cannot bypass the rules; closing freezes a consistent result. |
| 6. Verify | Validate inputs, protect session-based writes against CSRF, limit login/search requests. Test duplicate submissions, vote changes, nonmembers, phase restrictions, ties, zero votes and TMDB failures. | Automated tests and a two-user browser walkthrough pass. |
| 7. Release | Local development → isolated staging → production, with separate databases/secrets. Run tests in CI, rehearse migrations on staging, deploy the same tested commit. Add HTTPS, logs, health checks, backups and a rollback plan. | Friends complete a night on the live app. |

Use TMDB's [movie search endpoint](https://developer.themoviedb.org/reference/search-movie). Include its required approved logo and attribution notice in an About/Credits section. [TMDB requirements](https://developer.themoviedb.org/docs/faq)

**First action:** sketch the four screens and simulate a night with three friends, including a tie. A disabled “Add movie” button is only a visual aid; the server and database must enforce the limit.

**Portfolio finish:** add screenshots, setup instructions, a small architecture diagram and a short explanation of your voting constraints and staging-to-production release process to the README.
