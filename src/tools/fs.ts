import { tool } from 'ai';
import { execSync } from 'child_process';
import fs from 'fs';
import { z } from 'zod';

export const readFile = tool({
  description: 'Read file, can be used to read package.json, etc.',
  parameters: z.object({
    filePath: z.string(),
    encoding: z.enum(['utf8', 'base64']).optional().default('utf8'),
  }),
  execute: async ({ filePath, encoding }) => {
    try {
      const content = fs.readFileSync(filePath, encoding);
      return {
        success: true,
        file: content,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to read file',
      };
    }
  },
});

export const writeFile = tool({
  description: 'Write file, can be used to write package.json, etc.',
  parameters: z.object({
    filePath: z.string(),
    content: z.string(),
  }),
  execute: async ({ filePath, content }) => {
    try {
      fs.writeFileSync(filePath, content);
      return {
        success: true,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to write file',
      };
    }
  },
});

export const getFileTree = tool({
  description: 'Get file tree',
  parameters: z.object({
    depth: z.number().optional().default(1),
  }),
  execute: async ({ depth }) => {
    try {
      const output = execSync(
        `tree -J -I "node_modules|cache|*.pyc" -L ${depth}`,
        {
          cwd: process.cwd(),
        },
      ).toString();
      const fileTree = JSON.parse(output);

      return {
        success: true,
        fileTree,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : 'Failed to get file tree',
      };
    }
  },
});
