import { tool, generateText, stepCountIs } from 'ai';
import { z } from 'zod';
import { deepResearchTools } from '.';
import { createProvider } from '../utils/providers';
import { LLM_MODEL } from '../constants/providers';
import { DEEP_RESEARCH_SYSTEM_PROMPT } from '../constants/prompts/deepResearch';

// Extract tool results from steps to compile research findings
function extractToolResults(steps: any[]): string {
  const results: string[] = [];

  for (const step of steps) {
    if (!step.toolResults) continue;

    for (const toolResult of step.toolResults) {
      if (toolResult.result && typeof toolResult.result === 'string') {
        results.push(`### ${toolResult.toolName}\n${toolResult.result}`);
      } else if (toolResult.result?.value) {
        results.push(`### ${toolResult.toolName}\n${toolResult.result.value}`);
      }
    }
  }

  return results.join('\n\n---\n\n');
}

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
        stopWhen: stepCountIs(5),
        onStepFinish: step => {},
      });

      const { text, steps } = result;

      return (
        `**Final Answer:**\n\n${text}\n\n**Full Response:**\n\n${JSON.stringify(steps)}` ||
        'No response generated'
      );
    } catch (error) {
      console.error('Deep research error:', error);
      return `Deep research encountered an error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
