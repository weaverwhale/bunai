import { tool } from 'ai';
import { z } from 'zod';
import { v4 as uuidV4 } from 'uuid';

const MOBY_TLD = 'http://willy.srv.whale3.io';
const MOBY_ENDPOINT = `${MOBY_TLD}/answer-nlq-question`;

export const moby = tool({
  description:
    "Useful for getting e-commerce analytics and insights from Triple Whale's AI, Moby.",
  inputSchema: z.object({
    question: z.string().describe('Question to ask Triple Whale Moby'),
    shopId: z
      .string()
      .describe(
        'The Shopify store URL (e.g., storename.myshopify.com). This is REQUIRED and must be a real store URL, not a placeholder.'
      ),
    parentMessageId: z
      .string()
      .optional()
      .describe('Parent message ID for conversation context'),
  }),
  execute: async ({ question, shopId, parentMessageId }) => {
    console.log('[API] Executing moby tool with params:', question, shopId);

    try {
      const response = await fetch(MOBY_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          stream: false,
          shopId: shopId,
          conversationId: (parentMessageId || uuidV4()).toString(),
          source: 'chat',
          dialect: 'clickhouse',
          userId: 'test-user',
          additionalShopIds: [],
          question: question,
          query: question,
          generateInsights: true,
          isOutsideMainChat: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const lastMessageText =
        data.messages?.[data.messages.length - 1]?.text || data.text || ' ';

      return lastMessageText || 'No answer received from Moby. ';
    } catch (error) {
      console.error('Error querying Moby:', error);
      return 'Error: Could not fetch response from Triple Whale. ';
    }
  },
});
