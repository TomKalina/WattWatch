import { describe, it, expect, vi } from 'vitest';
import { getConfig } from '../config';
import type { WattWatchConfig } from '../types';

describe('Configuration Module', () => {
  describe('getConfig', () => {
    it('should return default config when no user config provided', () => {
      const config: WattWatchConfig = getConfig();

      expect(config.electricityRate).toBe(0.25);
      expect(config.currency).toBe('EUR');
    });

    it('should accept and merge custom config with defaults', () => {
      const config: WattWatchConfig = getConfig({ electricityRate: 0.3 });

      expect(config.electricityRate).toBe(0.3);
      expect(config.currency).toBe('EUR');
    });

    it('should accept full custom config', () => {
      const config: WattWatchConfig = getConfig({
        electricityRate: 0.15,
        currency: 'USD',
      });

      expect(config.electricityRate).toBe(0.15);
      expect(config.currency).toBe('USD');
    });

    it('should handle invalid electricity rate by falling back to default', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config: WattWatchConfig = getConfig({ electricityRate: -1 });

      expect(config.electricityRate).toBe(0.25);
      expect(config.currency).toBe('EUR');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));

      consoleSpy.mockRestore();
    });

    it('should handle invalid currency by falling back to default', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config: WattWatchConfig = getConfig({ currency: '' });

      expect(config.electricityRate).toBe(0.25);
      expect(config.currency).toBe('EUR');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));

      consoleSpy.mockRestore();
    });

    it('should handle zero electricity rate as invalid', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config: WattWatchConfig = getConfig({ electricityRate: 0 });

      expect(config.electricityRate).toBe(0.25);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
