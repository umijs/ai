import dedent from 'dedent';

// TODO: extract to a separate package
const TNFBestPracticesPrompt = dedent`
- How to add page.
  1. Run \`npx tnf g page {pageName}\` to generate a page.
- How to create a tnf project.
  1. Run \`npm create tnf --template simple\` to generate a project.
`;

export const BestPracticesPrompt = dedent`
BEST PRACTICES:
- Use TypeScript.
- Use Prettier for formatting. Perferred config: printWidth: 80, singleQuote: true, trailingComma: all, proseWrap: never, importOrderSortSpecifiers: true, use @trivago/prettier-plugin-sort-imports to sort imports.
- Perferred style: indent_style: space, indent_width: 2.
- How to add father as component bunder.
  1. add father as dev dependency
  2. add .fatherrc.ts, content: import { defineConfig } from 'father'; export default defineConfig({ cjs: { transformer: 'babel', input: 'src', output: 'dist' } });
  3. add "build": "father doctor && father build" to scripts in package.json
- How to add commitlint to enforce commit message convention.
  1. This depends on husky, so make sure husky is installed.
  2. add @commitlint/cli and @commitlint/config-conventional as dev dependency
  3. add .commitlintrc.js, content: module.exports = { extends: ['@commitlint/config-conventional'] };
  4. Create .husky/commit-msg file, content: npx --no -- commitlint --edit $1
- How to add lint-staged to format files on commit.
  1. add lint-staged as dev dependency
  2. add "lint-staged": { "*.{js,jsx,ts,tsx}": ["prettier --write"] } to package.json
- Do not use specifiers for \`fs\` and \`path\` modules.
- Do use \`test()\` instead of \`describe() + it()\` for test cases.
- Keep a log of what, why and how you did what you did in "fyi.md". Keep it updated.
- Make sure the created files are ending with a new line at the end of the file.
${TNFBestPracticesPrompt}
`;
