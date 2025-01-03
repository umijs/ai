import { createOpenAI } from '@ai-sdk/openai';
import * as p from '@umijs/clack-prompts';
import { CoreMessage, generateText } from 'ai';
import assert from 'assert';
import pc from 'picocolors';
import { SystemPrompt } from './prompts/system.js';
import { getBuiltinTools } from './tools/index.js';
import { MessageSchema } from './types.js';

interface ChatOptions {
  // default: {}
  tools?: Record<string, any>;
  // default: gpt-4o
  model?: 'gtp-4o' | 'gtp-4o-mini';
  // default: ''
  message?: string;
  // default: []
  systemPrompts?: string[];
  // default: 10
  maxSteps?: number;
  // default: false
  verbose?: boolean;
}

const CANCEL_TEXT = 'Operation cancelled.';
const DEFAULT_PROMPT = 'What do you want to do?';

export async function chat(opts: ChatOptions) {
  const verbose = opts.verbose || false;
  function debug(message: string) {
    if (verbose) {
      p.log.message(pc.gray(`[DEBUG] ${message}`), { symbol: '[DEBUG]' });
    }
  }

  let message = opts.message;
  if (!message) {
    message = (await p.text({
      message: DEFAULT_PROMPT,
    })) as string;
    if (p.isCancel(message)) {
      throw new Error(CANCEL_TEXT);
    }
    if (!message) {
      throw new Error('Message is required');
    }
  }
  debug(`Message: ${message}`);

  const messages: CoreMessage[] = [
    { role: 'system', content: DEFAULT_PROMPT },
    { role: 'user', content: message },
  ];

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  assert(OPENAI_API_KEY, 'OPENAI_API_KEY is required');
  const openai = createOpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const task = p.taskLog('Thinking...');

  const toolsCalled: string[] = [];
  while (true) {
    const response = await generateText({
      model: openai(opts.model || 'gpt-4o'),
      system: `
${SystemPrompt}
${opts.systemPrompts?.join('\n')}
      `,
      maxSteps: opts.maxSteps || 10,
      tools: {
        ...opts.tools,
        ...getBuiltinTools(),
      },
      messages,
      onStepFinish: (step) => {
        if (step.text) {
          task.text = `${step.text}\n`;
          p.log.info(step.text);
        }
        const toolCalls = step.toolCalls.map((toolCall) => toolCall.toolName);
        if (toolCalls.length > 0) {
          task.text = `Tools called: ${toolCalls.join(', ')}\n`;
          toolsCalled.push(...toolCalls);
        }
      },
    });

    task.success(`Done ${toolsCalled.join(', ')}`);

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

    let data: ReturnType<typeof MessageSchema.parse>;
    try {
      data = MessageSchema.parse(JSON.parse(response.text));
    } catch (error) {
      debug(`Error parsing message: ${error}`);
      debug(response.text);
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

    if (p.isCancel(answer)) {
      throw new Error(CANCEL_TEXT);
    }
    if (typeof answer !== 'string') {
      debug(`Answer is not a string: ${answer}`);
      break;
    }
    messages.push({ role: 'user', content: answer as string });
  }
}
