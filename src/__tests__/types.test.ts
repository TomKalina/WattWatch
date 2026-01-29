import { describe, it, expect } from 'vitest';
import type { EnergyProfile, TokenCount, SessionStats, WattWatchConfig } from '../types';

describe('Type Definitions', () => {
  describe('EnergyProfile', () => {
    it('should define energy rates for input, output, and reasoning tokens', () => {
      const profile: EnergyProfile = {
        input: 50,
        output: 500,
        reasoning: 500,
      };

      expect(profile.input).toBe(50);
      expect(profile.output).toBe(500);
      expect(profile.reasoning).toBe(500);
    });
  });

  describe('TokenCount', () => {
    it('should match OpenCode AssistantMessage.tokens structure', () => {
      const tokens: TokenCount = {
        input: 1000,
        output: 500,
        reasoning: 100,
        cache: {
          read: 200,
          write: 50,
        },
      };

      expect(tokens.input).toBe(1000);
      expect(tokens.output).toBe(500);
      expect(tokens.reasoning).toBe(100);
      expect(tokens.cache.read).toBe(200);
      expect(tokens.cache.write).toBe(50);
    });
  });

  describe('SessionStats', () => {
    it('should track session energy and cost', () => {
      const stats: SessionStats = {
        tokens: {
          input: 1000,
          output: 500,
          reasoning: 100,
          cache: { read: 200, write: 50 },
        },
        energyWh: 0.42,
        costEUR: 0.11,
        modelID: 'claude-sonnet',
      };

      expect(stats.energyWh).toBe(0.42);
      expect(stats.costEUR).toBe(0.11);
      expect(stats.modelID).toBe('claude-sonnet');
    });
  });

  describe('WattWatchConfig', () => {
    it('should define electricity rate and currency', () => {
      const config: WattWatchConfig = {
        electricityRate: 0.25,
        currency: 'EUR',
      };

      expect(config.electricityRate).toBe(0.25);
      expect(config.currency).toBe('EUR');
    });
  });
});
