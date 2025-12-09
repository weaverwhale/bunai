import { moby } from './moby';
import { webSearch } from './webSearch';
import { nitro } from './nitro';
import { deepResearch } from './deepResearch';
import { readUrl } from './readUrl';
import { wikipedia } from './wikipedia';
import { newsSearch } from './newsSearch';
import { saveNote, recallNotes, clearNotes } from './notes';

export const tools = {
  webSearch,
  moby,
  nitro,
  deepResearch,
};

export const deepResearchTools = {
  webSearch,
  readUrl,
  wikipedia,
  newsSearch,
  saveNote,
  recallNotes,
  clearNotes,
};
