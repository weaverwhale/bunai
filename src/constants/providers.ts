// AI SDK Models
export const LLM_MODEL = process.env.LLM_MODEL || 'qwen3-1.7b';
export const WEB_SEARCH_MODEL = process.env.SEARCH_MODEL || 'gpt-4.1-mini';
export const DEEP_RESEARCH_MODEL =
  process.env.DEEP_RESEARCH_MODEL || process.env.LLM_MODEL || 'qwen3-1.7b';

// AI SDK Configuration (LMStudio/OpenAI/etc)
export const AI_BASE_URL =
  process.env.AI_BASE_URL || 'http://localhost:1234/v1';
export const AI_API_KEY = process.env.AI_API_KEY || 'lm-studio';
