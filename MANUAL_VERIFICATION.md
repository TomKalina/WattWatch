# WattWatch - Manual Verification Guide

**Status**: Automated testing complete ✅ | Manual verification required ⚠️

---

## Prerequisites

- OpenCode installed and running
- WattWatch project directory accessible to OpenCode
- AI model configured in OpenCode (Claude, GPT-4, or Gemini recommended)

---

## Verification Steps

### Step 1: Load the Plugin

1. **Navigate to WattWatch directory**:

   ```bash
   cd /path/to/WattWatch
   ```

2. **Start OpenCode** in this directory:

   ```bash
   opencode .
   ```

3. **Verify plugin loads**:
   - Check OpenCode startup logs for plugin loading messages
   - No errors should appear related to WattWatch
   - Plugin file: `.opencode/plugins/wattwatch.ts`

**Expected**: Plugin loads without errors

---

### Step 2: Trigger AI Response

1. **Send a message to the AI** in OpenCode:

   ```
   Hello! Can you explain what TypeScript is?
   ```

2. **Wait for AI response** to complete

3. **Observe for toast notification**:
   - Toast should appear automatically after response completes
   - Should display within 1-2 seconds of response finishing

**Expected**: Toast notification appears

---

### Step 3: Verify Toast Format

The toast notification should display in this format:

```
Energy: ~X.XX Wh (~X.XX EUR) | X,XXX tokens
```

**Example**:

```
Energy: ~0.42 Wh (~0.11 EUR) | 12,340 tokens
```

**Verify**:

- [ ] Energy value shown in Wh (Watt-hours)
- [ ] Tilde (~) prefix indicates estimate
- [ ] Cost shown in EUR (or configured currency)
- [ ] Token count formatted with thousand separators
- [ ] All values are reasonable (not 0, not negative)

---

### Step 4: Test Multiple Interactions

1. **Send 2-3 more messages** to the AI
2. **Verify toast appears after each response**
3. **Check that energy values accumulate** (session total increases)

**Expected**:

- Toast appears after every AI response
- Energy values increase with each interaction
- No errors or crashes

---

### Step 5: Test Different Models (Optional)

If you have access to multiple models:

1. **Switch to a different model** (e.g., GPT-4 → Claude)
2. **Send a message**
3. **Verify toast still appears**
4. **Check energy values** (should differ based on model)

**Expected**:

- Works with all supported models
- Energy estimates vary by model size
- Unknown models show warning but still work

---

### Step 6: Test Edge Cases

#### Zero Tokens

1. Send a very short message: "Hi"
2. Verify toast handles small token counts gracefully

#### Long Conversation

1. Send a complex request requiring long response
2. Verify toast handles large token counts (10,000+)

#### Session Restart

1. Restart OpenCode
2. Send a message
3. Verify energy tracking starts fresh (not accumulated from previous session)

---

## Verification Checklist

### Core Functionality

- [ ] Plugin loads without errors
- [ ] Toast appears after AI responses
- [ ] Energy value displayed in Wh
- [ ] Cost displayed in EUR (or configured currency)
- [ ] Token count displayed with formatting
- [ ] Tilde (~) prefix indicates estimate

### Format Validation

- [ ] Format matches: `Energy: ~X.XX Wh (~X.XX EUR) | X,XXX tokens`
- [ ] Numbers have 2 decimal places
- [ ] Token count has thousand separators
- [ ] No missing or extra characters

### Behavior

- [ ] Toast appears automatically (no manual trigger needed)
- [ ] Works across multiple interactions
- [ ] Energy accumulates within session
- [ ] Resets on OpenCode restart
- [ ] Handles different models correctly

### Edge Cases

- [ ] Small token counts (< 100)
- [ ] Large token counts (> 10,000)
- [ ] Zero tokens (if possible)
- [ ] Unknown models (shows warning)

---

## Expected Energy Ranges

Use these as sanity checks:

| Model Class                    | Tokens | Approximate Energy |
| ------------------------------ | ------ | ------------------ |
| **Small** (Haiku, GPT-4o-mini) | 1,000  | ~0.01 Wh           |
| **Medium** (Sonnet, GPT-4o)    | 1,000  | ~0.02 Wh           |
| **Large** (Opus, GPT-4)        | 1,000  | ~0.05 Wh           |

**Typical conversation** (5,000 tokens): 0.05 - 0.25 Wh

---

## Troubleshooting

### Toast Doesn't Appear

**Check**:

1. Plugin file exists: `.opencode/plugins/wattwatch.ts`
2. OpenCode logs for errors
3. Session was created (send at least one message)
4. Wait for `session.idle` event (may take 1-2 seconds)

**Try**:

- Restart OpenCode
- Check console for JavaScript errors
- Verify plugin dependencies installed

### Wrong Format

**Check**:

1. OpenCode version (plugin API may have changed)
2. Toast implementation in OpenCode
3. Console logs for actual toast content

**Try**:

- Update OpenCode to latest version
- Check OpenCode plugin documentation

### Energy Values Seem Wrong

**Check**:

1. Model being used (check OpenCode settings)
2. Token counts (should be in thousands for typical conversations)
3. Electricity rate configuration (default: 0.25 EUR/kWh)

**Try**:

- Compare with expected ranges above
- Check model profile in `src/models.ts`
- Verify configuration in `opencode.json`

---

## Reporting Issues

If verification fails, please report:

1. **OpenCode version**: `opencode --version`
2. **Error messages**: From console or logs
3. **Screenshot**: Of toast notification (if appears)
4. **Model used**: Which AI model was active
5. **Token count**: From the interaction
6. **Expected vs Actual**: What you expected vs what happened

---

## Success Criteria

✅ **Verification PASSES if**:

- Toast appears after every AI response
- Format matches specification exactly
- Energy values are reasonable (not 0, not negative)
- No errors in console or logs

❌ **Verification FAILS if**:

- Toast never appears
- Format is incorrect or garbled
- Energy values are always 0 or negative
- Errors appear in console

---

## Next Steps After Verification

### If Verification Passes ✅

1. Mark manual verification items as complete in plan
2. Start using WattWatch in daily workflow
3. Monitor energy usage over time
4. Consider customizing electricity rate if needed

### If Verification Fails ❌

1. Document the failure in detail
2. Check troubleshooting section
3. Report issue with all required information
4. Wait for fix or workaround

---

**Good luck with verification!** 🎉
