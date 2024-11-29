import dedent from "dedent";

export const BestPracticesPrompt = dedent`

BEST PRACTICES:
- Use TypeScript.
- Use Prettier for formatting. Perferred config: printWidth: 80, singleQuote: true, trailingComma: all, proseWrap: never, importOrderSortSpecifiers: true, use @trivago/prettier-plugin-sort-imports to sort imports.
- Perferred style: indent_style: space, indent_width: 2.
- How to add father as component bunder.
  1. add father as dev dependency
  2. add .fatherrc.ts, content: import { defineConfig } from 'father'; export default defineConfig({ cjs: { transformer: 'babel', input: 'src', output: 'dist' } });
  3. add "build": "father doctor && father build" to scripts in package.json
- Keep a log of what, why and how you did what you did in "fyi.md". Keep it updated.
- Make sure the created files are ending with a new line at the end of the file.
`;
