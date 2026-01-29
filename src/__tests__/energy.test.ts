import { describe, it, expect } from 'vitest';
import { calculateEnergy, formatEnergy } from '../energy';
import type { TokenCount } from '../types';

describe('Energy Calculation', () => {
  describe('calculateEnergy', () => {
    it('should calculate energy for basic token usage', () => {
      const tokens: TokenCount = {
        input: 1000,
        output: 500,
        reasoning: 0,
        cache: { read: 0, write: 0 },
      };

      const result = calculateEnergy(tokens, 'claude-sonnet', 0.25);

      expect(result.energyWh).toBeCloseTo(0.12, 2);
      expect(result.costEUR).toBeCloseTo(0.00003, 5);
    });

    it('should handle cached tokens at 50% energy', () => {
      const tokens: TokenCount = {
        input: 0,
        output: 0,
        reasoning: 0,
        cache: { read: 1000, write: 0 },
      };

      const normalResult = calculateEnergy(
        { input: 1000, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
        'claude-sonnet',
        0.25
      );
      const cachedResult = calculateEnergy(tokens, 'claude-sonnet', 0.25);

      expect(cachedResult.energyWh).toBeCloseTo(normalResult.energyWh * 0.5, 5);
    });

    it('should handle zero tokens', () => {
      const tokens: TokenCount = {
        input: 0,
        output: 0,
        reasoning: 0,
        cache: { read: 0, write: 0 },
      };

      const result = calculateEnergy(tokens, 'claude-sonnet', 0.25);

      expect(result.energyWh).toBe(0);
      expect(result.costEUR).toBe(0);
    });

    it('should handle all token types', () => {
      const tokens: TokenCount = {
        input: 1000,
        output: 500,
        reasoning: 200,
        cache: { read: 100, write: 50 },
      };

      const result = calculateEnergy(tokens, 'claude-sonnet', 0.25);

      expect(result.energyWh).toBeGreaterThan(0);
      expect(result.costEUR).toBeGreaterThan(0);
    });

    it('should scale with different electricity rates', () => {
      const tokens: TokenCount = {
        input: 1000,
        output: 500,
        reasoning: 0,
        cache: { read: 0, write: 0 },
      };

      const result1 = calculateEnergy(tokens, 'claude-sonnet', 0.25);
      const result2 = calculateEnergy(tokens, 'claude-sonnet', 0.5);

      expect(result1.energyWh).toBe(result2.energyWh);
      expect(result2.costEUR).toBeCloseTo(result1.costEUR * 2, 5);
    });

    it('should use model-specific energy profiles', () => {
      const tokens: TokenCount = {
        input: 0,
        output: 1000,
        reasoning: 0,
        cache: { read: 0, write: 0 },
      };

      const haikuResult = calculateEnergy(tokens, 'claude-haiku', 0.25);
      const opusResult = calculateEnergy(tokens, 'claude-opus', 0.25);

      expect(opusResult.energyWh).toBeGreaterThan(haikuResult.energyWh);
    });

    it('should handle unknown models with fallback', () => {
      const tokens: TokenCount = {
        input: 1000,
        output: 500,
        reasoning: 0,
        cache: { read: 0, write: 0 },
      };

      const result = calculateEnergy(tokens, 'unknown-model', 0.25);

      expect(result.energyWh).toBeGreaterThan(0);
      expect(result.costEUR).toBeGreaterThan(0);
    });
  });

  describe('formatEnergy', () => {
    it('should format energy with units', () => {
      const formatted = formatEnergy(0.42, 0.11, 'EUR', 12340);

      expect(formatted).toBe('Energy: ~0.42 Wh (~0.11 EUR) | 12,340 tokens');
    });

    it('should handle small values', () => {
      const formatted = formatEnergy(0.001, 0.00025, 'EUR', 100);

      expect(formatted).toBe('Energy: ~0.00 Wh (~0.00 EUR) | 100 tokens');
    });

    it('should handle large values', () => {
      const formatted = formatEnergy(150.5, 37.625, 'EUR', 1000000);

      expect(formatted).toBe('Energy: ~150.50 Wh (~37.63 EUR) | 1,000,000 tokens');
    });

    it('should support different currencies', () => {
      const formatted = formatEnergy(0.42, 0.5, 'USD', 12340);

      expect(formatted).toContain('USD');
      expect(formatted).toBe('Energy: ~0.42 Wh (~0.50 USD) | 12,340 tokens');
    });
  });
});
