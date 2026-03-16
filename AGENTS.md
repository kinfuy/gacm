# AGENTS.md

## Cursor Cloud specific instructions

This is **GACM** — a Node.js CLI tool suite for managing Git accounts (`gacm`) and NPM registries (`gnrm`). No backend services, databases, or Docker required.

### Quick reference

| Action | Command |
|---|---|
| Install deps | `pnpm install` |
| Lint (with autofix) | `pnpm run lint` |
| Build | `echo "N" \| pnpm run build` |
| Link globally | `cd dist && pnpm link --global` |
| Test gacm | `gacm ls`, `gacm --version` |
| Test gnrm | `gnrm ls`, `gnrm --version` |

### Non-obvious caveats

- **Build prompts for version bump**: `pnpm run build` runs a Gulp pipeline whose first step (`update:version`) interactively asks whether to change the version. Pipe `echo "N"` to skip it: `echo "N" | pnpm run build`.
- **PNPM_HOME must be set**: The build's final step runs `pnpm link --global`, which requires `PNPM_HOME` to be configured. Run `pnpm setup` once and `source ~/.bashrc`, or export `PNPM_HOME="/home/ubuntu/.local/share/pnpm"` and add it to `PATH`.
- **No automated test suite**: This project has no unit or integration tests. Verification is done by building and running the CLI commands (`gacm`, `gnrm`).
- **Node.js deprecation warning**: `gnrm` commands emit a `[DEP0040] punycode` deprecation warning on Node 22+. This is harmless and comes from the `node-fetch` dependency.
- **Husky git hooks**: Pre-commit runs `lint-staged` (ESLint on `package/**/*.{js,ts,json,css,vue}`). Commit messages are validated by `commitlint` with Angular/conventional config.
