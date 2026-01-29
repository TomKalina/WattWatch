# WattWatch

**Real-time energy usage estimation for OpenCode AI sessions**

WattWatch is an OpenCode plugin that tracks token usage and estimates energy consumption (in Watt-hours) for AI model interactions. Get instant visibility into the environmental impact of your AI-powered development workflow.

## Features

- ⚡ **Energy Estimation**: Real-time Wh (Watt-hours) calculation based on token usage
- 💰 **Cost Tracking**: Electricity cost estimates in EUR (configurable)
- 🔔 **Toast Notifications**: Automatic energy summary after each AI response
- 📊 **Session Stats**: On-demand statistics via `/watt` command
- 🤖 **Multi-Model Support**: Pre-configured profiles for Claude, GPT-4, Gemini
- 🔄 **Smart Fallback**: Unknown models use medium energy estimate
- 🧪 **Fully Tested**: 40+ tests with 100% pass rate

## Installation

### For OpenCode Users

1. **Clone this repository** into your project:

   ```bash
   git clone https://github.com/your-username/wattwatch.git
   cd wattwatch
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **The plugin auto-loads** from `.opencode/plugins/wattwatch.ts` when you start OpenCode in this directory.

### Configuration (Optional)

Create or update `opencode.json` in your project root:

```json
{
  "wattwatch": {
    "electricityRate": 0.25,
    "currency": "EUR"
  }
}
```

**Defaults**:

- Electricity rate: `0.25 EUR/kWh` (Czech Republic average)
- Currency: `EUR`

## Usage

### Automatic Toast Notifications

After each AI response, WattWatch displays a toast notification:

```
Energy: ~0.42 Wh (~0.11 EUR) | 12,340 tokens
```

### Session Tracking

WattWatch automatically tracks energy usage throughout your OpenCode session. Energy estimates are displayed via toast notifications after each AI response, providing immediate feedback on your session's environmental impact.

## How It Works

### Energy Calculation

WattWatch uses pre-defined energy profiles based on approximate datacenter GPU power consumption:

| Model Class                | Example Models                    | Energy (Wh per 1K output tokens) |
| -------------------------- | --------------------------------- | -------------------------------- |
| **Large** (70B+ params)    | claude-opus, gpt-4                | ~0.5 Wh                          |
| **Medium** (20-70B params) | claude-sonnet, gpt-4o, gemini-pro | ~0.2 Wh                          |
| **Small** (<20B params)    | claude-haiku, gpt-4o-mini         | ~0.05 Wh                         |

**Formula**:

```
Energy (Wh) = (input × input_rate + output × output_rate +
               reasoning × reasoning_rate + cache × cache_rate) / 1,000,000
```

**Cache tokens** consume 50% less energy (reduced computation).

### Supported Models

- **Claude**: opus, sonnet, haiku (all versions)
- **GPT**: gpt-4, gpt-4o, gpt-4o-mini (all variants)
- **Gemini**: gemini-pro

Unknown models automatically use the medium energy profile with a warning.

## Development

### Run Tests

```bash
bun test
```

**Test Coverage**:

- ✅ Type definitions (4 tests)
- ✅ Configuration (6 tests)
- ✅ Model profiles (14 tests)
- ✅ Energy calculation (11 tests)
- ✅ Plugin integration (5 tests)

### Type Check

```bash
bunx tsc --noEmit
```

### Project Structure

```
wattwatch/
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── config.ts          # Configuration handling
│   ├── models.ts          # Model energy profiles
│   ├── energy.ts          # Energy calculation logic
│   └── __tests__/         # Unit tests
├── .opencode/
│   ├── plugins/
│   │   └── wattwatch.ts   # OpenCode plugin entry point
│   └── __tests__/         # Plugin integration tests
└── README.md
```

## Limitations

- **Estimates only**: Energy values are approximations based on typical datacenter GPU usage
- **No historical data**: Session stats are not persisted across OpenCode restarts
- **Toast notifications only**: Sidebar/panel integration not supported by OpenCode plugin API
- **Session-scoped**: Tracks energy per OpenCode session, not globally

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`bun test`)
5. Submit a pull request

## Author

Tomáš Kalina <info@tomaskalina.cz>

## License

MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Energy estimates based on research into LLM inference power consumption
- Built for the [OpenCode](https://opencode.ai) AI-powered development environment
- Inspired by the need for environmental awareness in AI development workflows
