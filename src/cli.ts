#!/usr/bin/env node
import { createOpenAI } from '@ai-sdk/openai';
import * as p from '@umijs/clack-prompts';
import { CoreMessage, generateText } from 'ai';
import assert from 'assert';
import fs from 'fs';
import pc from 'picocolors';
import yParser from 'yargs-parser';
import { loadConfig } from './config.js';
import { BasePrompt } from './prompts/base.js';
import { BestPracticesPrompt } from './prompts/best-practices.js';
import { getBuiltinTools, getUserTools } from './tools/index.js';
import { MessageSchema } from './types.js';

async function main() {
  const argv = yParser(process.argv.slice(2), {
    alias: {
      p: 'prompt',
      m: 'model',
      t: 'tools',
      c: 'context',
      f: 'files',
    },
  });
  const config = await loadConfig({ cwd: process.cwd() });
  let prompt = argv.prompt;
  if (fs.existsSync(prompt)) {
    prompt = fs.readFileSync(prompt, 'utf-8');
  }
  if (!prompt) {
    prompt =
      (await p.text({
        message: 'What do you want to do?',
      })) || '';
  }
  const model = argv.model || process.env.AI_MODEL || 'gpt-4o';
  const tools = {
    ...getBuiltinTools(),
    ...getUserTools(argv.tools || []),
    ...(config.tools || {}),
  };
  let context = argv.context;
  if (fs.existsSync(context)) {
    context = fs.readFileSync(context, 'utf-8');
  }
  // TODO: include file contents
  const files = argv.files;

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  assert(OPENAI_API_KEY, 'OPENAI_API_KEY is required');
  const openai = createOpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const messages: CoreMessage[] = [
    { role: 'system', content: 'What do you want to do?' },
    { role: 'user', content: prompt },
  ];

  const s = p.spinner();

  while (true) {
    s.start(pc.gray('Thinking...'));
    const response = await generateText({
      model: openai(model),
      system: `
${BasePrompt}
${BestPracticesPrompt}
${config.bestPractices || ''}

Context: ${context}
Related Files: ${files}`,
      tools,
      maxSteps: 10,
      messages,
    });

    const toolCalls = response.steps.flatMap((step) =>
      step.toolCalls.map((toolCall) => toolCall.toolName),
    );
    if (toolCalls.length > 0) {
      s.stop(`Tools called: ${pc.gray(toolCalls.join(', '))}`);
    } else {
      s.stop(pc.gray('Done.'));
    }

    for (const step of response.steps) {
      if (step.text.length > 0) {
        messages.push({ role: 'assistant', content: step.text });
      }
      if (step.toolCalls.length > 0) {
        messages.push({ role: 'assistant', content: step.toolCalls });
      }
      if (step.toolResults.length > 0) {
        // TODO: fix this upstream. for some reason, the tool does not include the type,
        // against the spec.
        for (const toolResult of step.toolResults) {
          if (!toolResult.type) {
            toolResult.type = 'tool-result';
          }
        }
        messages.push({ role: 'tool', content: step.toolResults });
      }
    }

    // TODO: handle parsing errors
    let data: ReturnType<typeof MessageSchema.parse>;
    try {
      data = MessageSchema.parse(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
      console.log(response.text);
      throw error;
    }
    const answer = await (() => {
      switch (data.type) {
        case 'select':
          return p.select({
            message: data.content,
            options: data.options.map((option) => ({
              value: option,
              label: option,
            })),
          });
        case 'question':
          return p.text({ message: data.content });
        case 'confirmation': {
          return p.confirm({ message: data.content }).then((answer) => {
            return answer ? 'yes' : 'no';
          });
        }
        case 'end':
          p.log.step(data.content);
      }
    })();

    if (typeof answer !== 'string') {
      p.outro(pc.gray('Bye!'));
      break;
    }

    messages.push({
      role: 'user',
      content: answer as string,
    });
  }
}

main().catch(console.error);
