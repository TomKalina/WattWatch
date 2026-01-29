import type { WattWatchConfig } from './types';

const DEFAULT_CONFIG: WattWatchConfig = {
  electricityRate: 0.25,
  currency: 'EUR',
};

export function getConfig(userConfig?: Partial<WattWatchConfig>): WattWatchConfig {
  if (!userConfig) {
    return { ...DEFAULT_CONFIG };
  }

  const config: WattWatchConfig = { ...DEFAULT_CONFIG };

  if (userConfig.electricityRate !== undefined) {
    if (userConfig.electricityRate > 0) {
      config.electricityRate = userConfig.electricityRate;
    } else {
      console.error(
        '[ERROR] Invalid electricity rate (must be positive). Using default: 0.25 EUR/kWh'
      );
    }
  }

  if (userConfig.currency !== undefined) {
    if (userConfig.currency.trim().length > 0) {
      config.currency = userConfig.currency;
    } else {
      console.error('[ERROR] Invalid currency (cannot be empty). Using default: EUR');
    }
  }

  return config;
}
