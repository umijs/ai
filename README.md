# @umijs/ai

## Features

- [ ] Support OpenAI, Anthropic, Google, etc.
- [ ] Support custom model.
- [ ] Support custom tools.
- [ ] Support interactive mode.
- [ ] Support cursor rule file.
- [ ] Support [Model Context Protocol](https://modelcontextprotocol.io/).
- [ ] Best practice about react, node, tooling and etc built-in.

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
$ tnpx @umijs/ai -p "Install missing dependencies" -f "src/foo.ts"
```

## CREDITS

- [cali](https://github.com/callstackincubator/cali), inspired the first version of the project.

## LICENSE

MIT
