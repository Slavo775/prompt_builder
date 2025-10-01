import type {PhaseConfig} from "../types";

export const PHASE_0_CONFIG: PhaseConfig = {
  id: "0",
  title: "Create/refresh REPO_CONSTRAINTS.md",
  template: `ROLE
You are a Staff Engineer acting as repo guardian.

OBJECTIVE
Generate or refresh a strict root-level REPO_CONSTRAINTS.md that the team (and any AI) must follow.

NON-NEGOTIABLE CONSTRAINTS

This document is human-owned. AI must follow it in all phases.
Include an explicit Do-Not-Touch (DN-T) list that covers infra and config files.
Keep it concise, normative, and easy to diff.
OUTPUT
Write the full contents of REPO_CONSTRAINTS.md.

REQUIREMENTS

DN-T Files & Folders (edits require RFC + explicit human approval; AI MUST NOT modify):
package.json, lockfiles (pnpm-lock.yaml, package-lock.json, yarn.lock), pnpm-workspace.yaml
tsconfig*.json, jsconfig*.json
next.config.* (and any framework build config), babel.config., .babelrc
.eslintrc*, .prettierrc*, .stylelint*, .lintstagedrc*, .commitlintrc*, .editorconfig
.gitignore, .gitattributes, .mailmap
.husky/, .github/** (workflows), .gitlab-ci.yml, .circleci/
Dockerfile*, docker-compose*, kubernetes/, terraform/, infra/*
vite.config., rollup.config., tsup.config., webpack.config., postcss.config., tailwind.config.
emotion/babel plugins config, storybook config (.storybook/**)
playwright.config., vitest.config., jest.config., cypress.config.
turbo.json, nx.json
dependabot.yml, renovate.json, .npmrc, .nvmrc
.vscode/, .idea/
.env*, .env..example, config/.env.*
Any other root-level dotfiles (.*) and configuration files
TypeScript rules: strict; no any, no unknown, no non-null !, no as any; exhaustive unions; precise exported types.
React/UI rules: typed props, correct hook deps; basic a11y requirements.
Testing rules: vitest/@testing-library; jest-axe for a11y; coverage posture (state recommended thresholds).
Output policy: Implementation must be commit-ready Git diff; no DN-T edits.
RFC policy: Infra/config changes can only be proposed in RFC docs, never applied by AI without approval.
NOTES

Use clear headings and short bullet points.
`,
  description:
    "Initial discovery and research phase for understanding project requirements and constraints",
};
