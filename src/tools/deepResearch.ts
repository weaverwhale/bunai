import { tool, generateText, stepCountIs } from 'ai';
import { z } from 'zod';
import { deepResearchTools } from '.';
import { createProvider } from '../utils/providers';
import { LLM_MODEL } from '../constants/providers';
import { DEEP_RESEARCH_SYSTEM_PROMPT } from '../constants/prompts/deepResearch';

export const deepResearch = tool({
  description:
    'Spawn a sub-agent that performs deep, thorough research on a complex topic. Use this for questions requiring multiple searches, cross-referencing, or detailed analysis. The sub-agent can make multiple tool calls to gather comprehensive information.',
  inputSchema: z.object({
    task: z
      .string()
      .describe(
        'The research task or question to investigate thoroughly. Be specific about what information is needed.'
      ),
    context: z
      .string()
      .optional()
      .describe(
        'Optional context from the conversation that might help the sub-agent (e.g., store URLs, user preferences)'
      ),
  }),
  execute: async ({ task, context }: { task: string; context?: string }) => {
    const provider = createProvider();

    try {
      // Use generateText with tools for multi-step agentic execution
      const result = await generateText({
        model: provider.chat(LLM_MODEL),
        system: `${DEEP_RESEARCH_SYSTEM_PROMPT}\n\n${context}`,
        prompt: task,
        tools: deepResearchTools,
        stopWhen: stepCountIs(10),
      });

      const { text, steps } = result;
      const cleanText = (text || '').replace(/<think>\s*<\/think>/g, '').trim();

      return (
        `**Final Answer:**\n\n${cleanText}\n\n**Full Response:**\n\n${steps.join('\n')}` ||
        'No response generated'
      );
    } catch (error) {
      console.error('Deep research error:', error);
      return `Deep research encountered an error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
