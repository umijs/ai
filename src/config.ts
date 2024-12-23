import { loadConfig as loadC12Config } from 'c12';
import { z } from 'zod';

interface ConfigOpts {
  cwd: string;
  defaults?: Partial<Config>;
  overrides?: Partial<Config>;
}

const ConfigSchema = z.object({
  bestPractices: z.string(),
  tools: z.record(z.string(), z.any()),
});

type Config = z.infer<typeof ConfigSchema>;

export async function loadConfig(opts: ConfigOpts): Promise<Config> {
  const { config: rawConfig } = await loadC12Config({
    cwd: opts.cwd,
    configFile: '.umiai.ts',
    rcFile: false as const,
    globalRc: false as const,
    defaults: opts.defaults,
    overrides: opts.overrides,
  });
  const result = ConfigSchema.safeParse(rawConfig);
  if (!result.success) {
    throw new Error(`Invalid configuration: ${result.error.message}`);
  }
  return result.data;
}
