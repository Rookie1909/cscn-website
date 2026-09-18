# Branch protection setup

After pushing these changes and the first CI workflow run completes on `main`, enable branch protection in GitHub:

1. Open **Settings → Branches → Add branch ruleset** (or **Add rule** for classic protection).
2. Target branch: `main`.
3. Enable **Require status checks to pass before merging**.
4. Search for and select **CI / quality** (the job name from `.github/workflows/ci.yml`).
5. Optionally enable **Require a pull request before merging** and **Require approvals** for team review.

This cannot be configured from the repository files; it requires admin access on the GitHub repo.
