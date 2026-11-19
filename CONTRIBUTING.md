# Contributing

Thank you for your help. This file tells you how to send a change.

## Set up

1. Clone the repository.
2. Install Node.js 22.18 or later and these scanners. The hooks need each of
   them and block when one is missing:
   - [gitleaks](https://github.com/gitleaks/gitleaks)
   - [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
   - [actionlint](https://github.com/rhysd/actionlint)
   - [zizmor](https://github.com/zizmorcore/zizmor)
   - [osv-scanner](https://github.com/google/osv-scanner)
   - [semgrep](https://github.com/semgrep/semgrep)
   - [lizard](https://github.com/terryyin/lizard)
3. Turn on the Git hooks and install the dependencies:

   ```sh
   scripts/setup-hooks
   npm ci --ignore-scripts
   ```

`scripts/setup-hooks` prints a warning for each scanner that is missing.

## Make a change

1. Make the change. [AGENTS.md](AGENTS.md) lists the layout rules and the
   commands.
2. Run the checks:

   ```sh
   npm run lint
   npm run typecheck
   npm run smoke
   npm run build
   ```

3. Install the plugin in your bb and check the thread page:

   ```sh
   bb plugin install "$PWD" --yes
   ```

## Commit

- Sign each commit and add a DCO sign-off: `git commit -s -S`.
- Use a Conventional Commits subject and add a body that tells why.
  [.githooks/GIT_CONVENTION.md](.githooks/GIT_CONVENTION.md) has the rules.
- All hooks must pass. Do not use `--no-verify`.

## Pull requests

Keep each pull request to one goal. In the description, tell what you checked
in a running bb.

## Security

Do not report a vulnerability in a public issue. Use the steps in
[SECURITY.md](SECURITY.md).
