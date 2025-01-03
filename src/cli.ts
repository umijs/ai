#!/usr/bin/env node
import * as p from '@umijs/clack-prompts';
import pc from 'picocolors';
import yParser from 'yargs-parser';
import { z } from 'zod';
import { chat } from './chat.js';

const args = yParser(process.argv.slice(2), {
  alias: {},
});

console.log();
p.intro(`Welcome to the Umi AI CLI!`);

// validate args
try {
  const schema = z.object({
    message: z.string().optional(),
    model: z.enum(['gpt-4o', 'gpt-4o-mini']).optional(),
    verbose: z.boolean().optional(),
  });
  schema.parse(args);
} catch (error) {
  // @ts-ignore
  p.cancel(`Argument error: ${error.issues[0].message}`);
  process.exit(1);
}

chat({
  message: args.message,
  model: args.model,
  verbose: args.verbose,
})
  .then(() => {
    p.outro(pc.gray('Bye!'));
  })
  .catch((error) => {
    p.cancel(error.message);
  });
