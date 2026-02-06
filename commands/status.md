---
name: mastra-demo:status
description: Show demo project state and next steps
argument-hint: "[--project <path>]"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---

<objective>
Display current project status and recommend next action.
</objective>

<context>
Arguments: $ARGUMENTS

Parse flags:
- `--project <path>` - Project directory (default: current)
</context>

<process>

1. **Find project**
   - Check for .mastra-demo-state.json in current directory or --project path
   - If not found, check for DEMO_SCRIPT.md (project exists but not initialized)
   - Error if neither found

2. **Read state file**
   ```bash
   cat .mastra-demo-state.json
   ```

3. **Read DEMO_SCRIPT.md**
   - Count total segments
   - Get segment IDs

4. **Check actual files**
   ```bash
   # Check GIFs
   ls -1 public/*.gif 2>/dev/null

   # Check audio
   ls -1 public/*.mp3 2>/dev/null

   # Check composition
   test -f src/DemoVideo.tsx && echo "exists"

   # Check output
   ls -1 out/*.mp4 2>/dev/null
   ```

5. **Build status report**

   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    MASTRA DEMO ► <project-name>
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Script: DEMO_SCRIPT.md <status>
     - <N> segments defined
     - Narrative: <word-count> words

   ───────────────────────────────────────────────────────

   Segments:

   | Segment | GIF | Audio | Duration |
   |---------|-----|-------|----------|
   | segment-01-intro | ✓ | ✓ | 12.5s |
   | segment-02-demo | ✓ | ✗ | - |
   | segment-03-outro | ✗ | ✗ | - |

   ───────────────────────────────────────────────────────

   Composition: <status>
   Output: <status>

   ───────────────────────────────────────────────────────

   ▶ Next Step

   <recommended-action>

   ───────────────────────────────────────────────────────
   ```

6. **Determine next step**

   Priority order:
   1. If no DEMO_SCRIPT.md content → "Edit DEMO_SCRIPT.md with your demo"
   2. If segments missing GIFs → `/mastra-demo:record --segment <first-missing>`
   3. If segments missing audio → `/mastra-demo:audio --segment <first-missing>`
   4. If not composed → `/mastra-demo:compose`
   5. If not rendered → `/mastra-demo:render`
   6. If complete → "Demo complete! Output: out/demo.mp4"

7. **Output status**
   Display the formatted status report with next step recommendation.

</process>

<status_symbols>
- ✓ Complete
- ✗ Missing
- ⟳ In progress
- ⚠ Error/issue
</status_symbols>

<example_output>
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 MASTRA DEMO ► auth-demo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Script: DEMO_SCRIPT.md ✓
  - 5 segments defined
  - Narrative: 847 words

───────────────────────────────────────────────────────

Segments:

| Segment | GIF | Audio | Duration |
|---------|-----|-------|----------|
| segment-01-login | ✓ | ✓ | 14.5s |
| segment-02-admin | ✓ | ✓ | 12.3s |
| segment-03-change | ✗ | ✗ | - |
| segment-04-denied | ✗ | ✗ | - |
| segment-05-wrapup | ✗ | ✗ | - |

───────────────────────────────────────────────────────

Composition: Not built (3 segments incomplete)
Output: -

───────────────────────────────────────────────────────

▶ Next Step

/mastra-demo:record --segment segment-03-change

───────────────────────────────────────────────────────
```
</example_output>

<success_criteria>
- [ ] Project found
- [ ] State accurately reflected
- [ ] All segments accounted for
- [ ] Clear next step provided
</success_criteria>
