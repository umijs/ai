import { tool } from 'ai';
import { execSync } from 'child_process';
import { z } from 'zod';

export const installNpmPackage = tool({
  description: 'Install a package',
  parameters: z.object({
    packageNames: z.array(z.string()),
    dev: z.boolean().optional(),
  }),
  execute: async ({ packageNames, dev }) => {
    try {
      execSync(
        `pnpm install ${packageNames.join(' ')} ${dev ? '--save-dev' : ''}`,
        {
          cwd: process.cwd(),
        },
      );
      return {
        success: true,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : `Failed to install packages: ${error}`,
      };
    }
  },
});
