import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Helper to parse Server-Sent Events response
function parseSSEResponse(text: string): any {
  const lines = text.split('\n');
  let lastData: any = null;

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const dataStr = line.substring(6).trim();
      if (dataStr && dataStr !== '[DONE]') {
        try {
          lastData = JSON.parse(dataStr);
        } catch (e) {
          console.error('Failed to parse SSE data:', dataStr);
        }
      }
    }
  }

  if (lastData) {
    if (lastData.result) return lastData.result;
    if (lastData.error) {
      throw new Error(
        `MCP Error ${lastData.error.code}: ${lastData.error.message}`
      );
    }
    return lastData;
  }

  throw new Error('No valid data found in SSE response');
}

// Ask Nitro AI a question
async function askNitro(question: string): Promise<string> {
  const baseUrl = process.env.NITRO_BASE_URL || '';
  const apiKey = process.env.NITRO_API_KEY || '';

  const request = {
    jsonrpc: '2.0' as const,
    id: uuidv4(),
    method: 'tools/call',
    params: {
      name: 'ask-nitro',
      arguments: {
        question,
        user_id: uuidv4(),
      },
    },
  };

  const url = `${baseUrl}?api_key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');

  // Handle SSE streaming response
  let result: any;
  if (contentType?.includes('text/event-stream')) {
    const text = await response.text();
    result = parseSSEResponse(text);
  } else {
    // Handle regular JSON response
    const data = await response.json();
    if (data.error) {
      throw new Error(`MCP Error ${data.error.code}: ${data.error.message}`);
    }
    result = data.result;
  }

  // Extract text content from the response
  if (result.content && result.content.length > 0) {
    const text = result.content
      .filter((item: any) => item.type === 'text')
      .map((item: any) => item.text)
      .join('\n');

    // Filter out tool call info like {"tool":"books"}
    return text.replace(/\{"tool":"[^"]+"\}/g, '').trim();
  }

  return 'No response received from Nitro AI';
}

const nitro = {
  id: 'nitro',
  name: 'Nitro AI',
  description: 'Ask Nitro AI a question',
  inputSchema: z.object({
    question: z
      .string()
      .describe('A detailed natural language question to ask Nitro AI'),
  }),
  execute: async ({ question }: { question: string }): Promise<string> => {
    try {
      return await askNitro(question);
    } catch (error) {
      console.error('Error:', error);
      return 'Error: ' + error;
    }
  },
};

export { nitro };
