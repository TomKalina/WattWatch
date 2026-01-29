import type { TokenCount } from './types';
import { getEnergyProfile } from './models';

const CACHE_FACTOR = 0.5;

export interface EnergyResult {
  energyWh: number;
  costEUR: number;
}

export function calculateEnergy(
  tokens: TokenCount,
  modelID: string,
  electricityRate: number
): EnergyResult {
  const profile = getEnergyProfile(modelID);

  const inputEnergy = (tokens.input * profile.input) / 1_000_000;
  const outputEnergy = (tokens.output * profile.output) / 1_000_000;
  const reasoningEnergy = (tokens.reasoning * profile.reasoning) / 1_000_000;

  const cacheReadEnergy = (tokens.cache.read * profile.input * CACHE_FACTOR) / 1_000_000;
  const cacheWriteEnergy = (tokens.cache.write * profile.input * CACHE_FACTOR) / 1_000_000;

  const totalEnergyWh =
    inputEnergy + outputEnergy + reasoningEnergy + cacheReadEnergy + cacheWriteEnergy;

  const energyKWh = totalEnergyWh / 1000;
  const costEUR = energyKWh * electricityRate;

  return {
    energyWh: totalEnergyWh,
    costEUR: costEUR,
  };
}

export function formatEnergy(
  energyWh: number,
  costEUR: number,
  currency: string,
  totalTokens: number
): string {
  const formattedEnergy = energyWh.toFixed(2);
  const formattedCost = costEUR.toFixed(2);
  const formattedTokens = totalTokens.toLocaleString('en-US');

  return `Energy: ~${formattedEnergy} Wh (~${formattedCost} ${currency}) | ${formattedTokens} tokens`;
}
