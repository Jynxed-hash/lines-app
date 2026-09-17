# Lines / lines-app — GitHub etiquette

Host is **GitHub** (`lines-app`), via `gh`. Do not create a Cursor `origin` remote for this repo.

## Reviewer gate (mandatory)

Before **every commit** and before **every pull**:

1. Run `code-reviewer` and `security-reviewer` (or an equivalent local review of the same diffs).
2. Do **not** commit or pull until those reviews pass or their findings are fixed.
3. Do not skip this gate for “just a scaffold,” docs-only, or the initial commit.

## Before pull

1. Review local uncommitted work. Do not pull over a dirty tree blindly.
2. Commit (after the reviewer gate) or stash only what is safe.
3. Pull with rebase onto `main` (`git pull --rebase origin main`) unless a merge is explicitly needed.
4. Never `git pull --force` / never destroy local work.
5. Never skip hooks (`--no-verify`, `--no-gpg-sign`) unless the user explicitly asks.

## Before push

1. Commit first. The reviewer gate must already have passed for that commit.
2. First push of a branch: `git push -u origin HEAD`.
3. Never force-push `main` or `master`. Warn if anyone asks.
4. Never `--no-verify` unless the user explicitly asks.
5. Do not push secrets, `.env`, `.env*.local`, keys, or `node_modules`.

## Branches and PRs

- Default branch: `main`.
- Feature work: `feat/short-name`, fixes: `fix/short-name`.
- Open PRs **into `main`** with `gh pr create`. Do not commit straight to `main` after the initial scaffold unless the user asks.
- Commit messages: 1–2 sentences on **why**, conventional prefix (`feat:`, `fix:`, `docs:`, `chore:`).
- Pass the message via a HEREDOC. No `git commit -i` / `git add -i` / `git rebase -i`.

## Git safety (never)

- Never change `git config`.
- Never destructive git (`push --force` to main, `reset --hard`, etc.) unless the user explicitly asks.
- Never amend unless: user asked **or** a hook rewrote files on a commit **you** just created that is not pushed. If a hook **rejected** a commit, make a **new** commit.
- Never amend a commit that is already on the remote unless the user asks (and that implies force-push).

## Lines / Expo specifics

Do not commit: `node_modules/`, `.expo/`, `dist/`, `web-build/`, `expo-env.d.ts`, `.env`, `.env*.local`, `*.pem`, `*.jks`, `*.p8`, `*.p12`, `*.key`, `/ios`, `/android`.

`.env.example` (empty keys only) is OK. Real Supabase URL/anon keys stay local.
