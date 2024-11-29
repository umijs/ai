# @umijs/ai

## Features

- [ ] Support OpenAI, Anthropic, Google, etc.
- [ ] Support custom model.
- [ ] Support custom tools.
- [ ] Support interactive mode.
- [ ] Support cursor rule file.
- [ ] Support [Model Context Protocol](https://modelcontextprotocol.io/).

## Usage

```bash
$ tnpx @umijs/ai [options]
```

## Options

- `-p, --prompt`: The prompt to use.
- `-m, --model`: The model to use.
- `-t, --tools`: The tools to use.
- `-c, --context`: The context to use.
- `-f, --files`: The files to use, supports glob pattern.

## Examples

```bash
$ tnpx @umijs/ai -p "Create a new tnf project"
$ tnpx @umijs/ai -p "Write tests" -f "src/foo.ts"
$ tnpx @umijs/ai -p "Add prettier"
$ tnpx @umijs/ai -p "Add page foo"
```

## LICENSE

MIT
