import type { EnergyProfile } from './types';

export const MODEL_ENERGY_PROFILES: Record<string, EnergyProfile> = {
  'claude-opus': { input: 50, output: 500, reasoning: 500 },
  'claude-sonnet': { input: 20, output: 200, reasoning: 200 },
  'claude-haiku': { input: 5, output: 50, reasoning: 50 },
  'gpt-4': { input: 50, output: 500, reasoning: 500 },
  'gpt-4o': { input: 20, output: 200, reasoning: 200 },
  'gpt-4o-mini': { input: 5, output: 50, reasoning: 50 },
  'gemini-pro': { input: 20, output: 200, reasoning: 200 },
};

export const FALLBACK_PROFILE: EnergyProfile = {
  input: 20,
  output: 200,
  reasoning: 200,
};

export function getEnergyProfile(modelID: string): EnergyProfile {
  const normalizedModel = modelID.toLowerCase();

  if (MODEL_ENERGY_PROFILES[normalizedModel]) {
    return MODEL_ENERGY_PROFILES[normalizedModel];
  }

  const sortedKeys = Object.keys(MODEL_ENERGY_PROFILES).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const keyParts = key.split('-');
    const modelParts = normalizedModel.split('-');

    const allPartsMatch = keyParts.every((part) => modelParts.includes(part));

    if (allPartsMatch) {
      return MODEL_ENERGY_PROFILES[key];
    }
  }

  console.warn(
    `[WARNING] Unknown model "${modelID}". Using fallback energy profile (medium estimate).`
  );

  return { ...FALLBACK_PROFILE };
}
