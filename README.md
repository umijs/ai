# @umijs/ai

[![](https://badgen.net/npm/v/@umijs/ai)](https://www.npmjs.com/package/@umijs/ai)
[![](https://badgen.net/npm/dm/@umijs/ai)](https://www.npmjs.com/package/@umijs/ai)
[![](https://github.com/umijs/ai/actions/workflows/ci.yml/badge.svg)](https://github.com/umijs/ai/actions/workflows/ci.yml)
[![](https://badgen.net/npm/license/umi)](https://www.npmjs.com/package/@umijs/ai)

## Usage

```bash
$ npx @umijs/ai [options]
```

## Options

- `--model`: The model to use.
- `--message`: The message to use.

## Examples

```bash
$ npx @umijs/ai --message "Create a new tnf project"
$ npx @umijs/ai --message "Write tests for src/foo.ts"
$ npx @umijs/ai --message "Add prettier"
$ npx @umijs/ai --message "Add page foo"
$ npx @umijs/ai --message "Install missing dependencies for src/foo.ts"
```

## API

```ts
import { chat } from '@umijs/ai';
import * as p from '@umijs/clack-prompts';

p.intro(`Welcome!`);
chat({
  message: 'Create a new tnf project',
  model: 'gpt-4o',
  verbose: true,
})
  .then(() => {
    p.outro(pc.gray('Bye!'));
  })
  .catch((error) => {
    p.cancel(error.message);
  });
```

## CREDITS

This project is inspired by:

- [cali](https://github.com/callstackincubator/cali), inspired the first version of the project.

## LICENSE

[MIT](LICENSE)
