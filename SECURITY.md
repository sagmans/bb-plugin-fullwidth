# Security policy

## Supported versions

Only the latest commit on `main` gets security fixes.

## Report a vulnerability

Do not open a public issue.

Use GitHub private vulnerability reporting: open the repository's **Security**
tab and select **Report a vulnerability**. Include:

- the bb version and the plugin commit,
- the steps to reproduce the problem,
- the effect that you saw.

## Scope

The plugin adds one CSS rule set to bb's thread page. It does not make network
requests, read data, or store data. bb runs plugins as full-trust page code, so
a change that adds more than layout rules is a security change.
