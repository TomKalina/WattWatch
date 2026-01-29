/**
 * WattWatch Type Definitions
 *
 * Core types for energy consumption tracking in OpenCode sessions.
 */

/**
 * Energy profile defining Wh per million tokens for each token type.
 * Rates are based on approximate datacenter GPU power consumption for inference.
 */
export interface EnergyProfile {
  /** Wh per million input tokens */
  input: number;
  /** Wh per million output tokens */
  output: number;
  /** Wh per million reasoning tokens */
  reasoning: number;
}

/**
 * Token count structure matching OpenCode's AssistantMessage.tokens.
 * Tracks all token types including cached tokens.
 */
export interface TokenCount {
  /** Number of input tokens */
  input: number;
  /** Number of output tokens */
  output: number;
  /** Number of reasoning tokens */
  reasoning: number;
  /** Cached token counts */
  cache: {
    /** Cache read tokens */
    read: number;
    /** Cache write tokens */
    write: number;
  };
}

/**
 * Session statistics tracking total energy consumption and cost.
 */
export interface SessionStats {
  /** Total tokens used in session */
  tokens: TokenCount;
  /** Estimated energy consumption in Watt-hours */
  energyWh: number;
  /** Estimated cost in EUR */
  costEUR: number;
  /** Model identifier */
  modelID: string;
}

/**
 * User configuration for WattWatch plugin.
 */
export interface WattWatchConfig {
  /** Electricity rate in EUR per kWh */
  electricityRate: number;
  /** Currency code (e.g., "EUR") */
  currency: string;
}
