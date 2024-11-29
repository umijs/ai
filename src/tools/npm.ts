import { tool } from "ai";
import { z } from "zod";
import { execSync } from 'child_process';

export const installNpmPackage = tool({
  description: 'Install a package',
  parameters: z.object({
    packageNames: z.array(z.string()),
    dev: z.boolean().optional(),
  }),
  execute: async ({ packageNames, dev }) => {
    try {
      console.log(`Installing ${packageNames.join(', ')} ${dev ? '--save-dev' : ''}`);
      execSync(`pnpm install ${packageNames.join(' ')} ${dev ? '--save-dev' : ''}`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : `Failed to install packages: ${error}`,
      }
    }
  },
});
