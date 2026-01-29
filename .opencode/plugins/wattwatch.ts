import type { Plugin } from '@opencode-ai/plugin';
import { calculateEnergy, formatEnergy } from '../../src/energy';
import { getConfig } from '../../src/config';
import type { TokenCount, SessionStats } from '../../src/types';

const sessionStatsMap = new Map<string, SessionStats>();

export const WattWatch: Plugin = async ({ client }) => {
  const config = getConfig();

  return {
    'session.created': async ({ event }) => {
      const sessionId = event.session.id;

      sessionStatsMap.set(sessionId, {
        tokens: {
          input: 0,
          output: 0,
          reasoning: 0,
          cache: { read: 0, write: 0 },
        },
        energyWh: 0,
        costEUR: 0,
        modelID: '',
      });
    },

    'message.updated': async ({ event }) => {
      if (event.message.role !== 'assistant') {
        return;
      }

      const sessionId = event.session.id;
      const stats = sessionStatsMap.get(sessionId);

      if (!stats) {
        return;
      }

      const messageTokens = event.message.tokens;
      if (!messageTokens) {
        return;
      }

      stats.tokens.input += messageTokens.input || 0;
      stats.tokens.output += messageTokens.output || 0;
      stats.tokens.reasoning += messageTokens.reasoning || 0;
      stats.tokens.cache.read += messageTokens.cache?.read || 0;
      stats.tokens.cache.write += messageTokens.cache?.write || 0;

      stats.modelID = event.message.modelID || stats.modelID;

      const energyResult = calculateEnergy(stats.tokens, stats.modelID, config.electricityRate);

      stats.energyWh = energyResult.energyWh;
      stats.costEUR = energyResult.costEUR;
    },

    'session.idle': async ({ event }) => {
      const sessionId = event.session.id;
      const stats = sessionStatsMap.get(sessionId);

      if (!stats || stats.energyWh === 0) {
        return;
      }

      const totalTokens =
        stats.tokens.input +
        stats.tokens.output +
        stats.tokens.reasoning +
        stats.tokens.cache.read +
        stats.tokens.cache.write;

      const message = formatEnergy(stats.energyWh, stats.costEUR, config.currency, totalTokens);

      await client.tui.toast.show(message);
    },
  };
};
