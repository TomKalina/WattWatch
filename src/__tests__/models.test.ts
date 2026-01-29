import { describe, it, expect, vi } from 'vitest';
import { getEnergyProfile, FALLBACK_PROFILE } from '../models';

describe('Model Energy Profiles', () => {
  describe('getEnergyProfile', () => {
    describe('known models', () => {
      it('should return profile for claude-opus', () => {
        const profile = getEnergyProfile('claude-opus');

        expect(profile.input).toBe(50);
        expect(profile.output).toBe(500);
        expect(profile.reasoning).toBe(500);
      });

      it('should return profile for claude-sonnet', () => {
        const profile = getEnergyProfile('claude-sonnet');

        expect(profile.input).toBe(20);
        expect(profile.output).toBe(200);
        expect(profile.reasoning).toBe(200);
      });

      it('should return profile for claude-haiku', () => {
        const profile = getEnergyProfile('claude-haiku');

        expect(profile.input).toBe(5);
        expect(profile.output).toBe(50);
        expect(profile.reasoning).toBe(50);
      });

      it('should return profile for gpt-4', () => {
        const profile = getEnergyProfile('gpt-4');

        expect(profile.input).toBe(50);
        expect(profile.output).toBe(500);
        expect(profile.reasoning).toBe(500);
      });

      it('should return profile for gpt-4o', () => {
        const profile = getEnergyProfile('gpt-4o');

        expect(profile.input).toBe(20);
        expect(profile.output).toBe(200);
        expect(profile.reasoning).toBe(200);
      });

      it('should return profile for gpt-4o-mini', () => {
        const profile = getEnergyProfile('gpt-4o-mini');

        expect(profile.input).toBe(5);
        expect(profile.output).toBe(50);
        expect(profile.reasoning).toBe(50);
      });

      it('should return profile for gemini-pro', () => {
        const profile = getEnergyProfile('gemini-pro');

        expect(profile.input).toBe(20);
        expect(profile.output).toBe(200);
        expect(profile.reasoning).toBe(200);
      });
    });

    describe('fuzzy matching', () => {
      it('should match claude-3-5-sonnet-20241022 to claude-sonnet profile', () => {
        const profile = getEnergyProfile('claude-3-5-sonnet-20241022');

        expect(profile.input).toBe(20);
        expect(profile.output).toBe(200);
        expect(profile.reasoning).toBe(200);
      });

      it('should match claude-3-opus to claude-opus profile', () => {
        const profile = getEnergyProfile('claude-3-opus');

        expect(profile.input).toBe(50);
        expect(profile.output).toBe(500);
        expect(profile.reasoning).toBe(500);
      });

      it('should match gpt-4-turbo to gpt-4 profile', () => {
        const profile = getEnergyProfile('gpt-4-turbo');

        expect(profile.input).toBe(50);
        expect(profile.output).toBe(500);
        expect(profile.reasoning).toBe(500);
      });

      it('should match gpt-4o-2024-05-13 to gpt-4o profile', () => {
        const profile = getEnergyProfile('gpt-4o-2024-05-13');

        expect(profile.input).toBe(20);
        expect(profile.output).toBe(200);
        expect(profile.reasoning).toBe(200);
      });
    });

    describe('unknown models', () => {
      it('should return fallback profile for unknown model', () => {
        const profile = getEnergyProfile('unknown-model-xyz');

        expect(profile).toEqual(FALLBACK_PROFILE);
        expect(profile.input).toBe(20);
        expect(profile.output).toBe(200);
        expect(profile.reasoning).toBe(200);
      });

      it('should return fallback profile for empty string', () => {
        const profile = getEnergyProfile('');

        expect(profile).toEqual(FALLBACK_PROFILE);
      });

      it('should log warning for unknown model', () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        getEnergyProfile('unknown-model-xyz');

        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown model'));
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown-model-xyz'));

        consoleWarnSpy.mockRestore();
      });
    });
  });
});
