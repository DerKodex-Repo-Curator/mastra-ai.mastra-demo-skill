---
name: mastra-demo:script
description: Generate or validate DEMO_SCRIPT.md interactively
argument-hint: "[--validate] [--project <path>]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
---

<objective>
Help create a cohesive demo script with natural narrative flow, or validate an existing one.
</objective>

<context>
Arguments: $ARGUMENTS

Parse flags:
- `--validate` - Validate existing DEMO_SCRIPT.md instead of creating
- `--project <path>` - Project directory (default: current)
</context>

<process>

## Interactive Mode (default)

1. **Check for existing script**
   If DEMO_SCRIPT.md exists with content, ask:
   "DEMO_SCRIPT.md already exists. Do you want to edit it or start fresh?"

2. **Gather information**

   Ask the user:

   a. **Feature overview**
      "What feature are you demoing? Give me a one-sentence summary."

   b. **Value proposition**
      "What's the key value viewers should understand?"

   c. **Demo walkthrough**
      "Walk me through the steps. What will you show?"

   d. **Target audience**
      "Who is this demo for? (developers, product managers, etc.)"

3. **Generate narrative**

   Write a full narrative as 2-3 paragraphs of continuous prose.
   This tells the complete story without segment breaks.

   Show to user:
   ```
   Here's the narrative I've drafted:

   ---
   [narrative text]
   ---

   Does this capture what you want to convey? Any changes?
   ```

   Iterate until approved.

4. **Break into segments**

   Identify natural transition points in the narrative.
   Each segment should:
   - Have a clear purpose
   - Connect to the previous segment
   - Set up the next segment

   Show segment breakdown:
   ```
   I've broken this into <N> segments:

   1. segment-01-intro: [purpose]
      Voiceover: "[first line]..."

   2. segment-02-demo: [purpose]
      Voiceover: "[first line]..."

   Does this segmentation work?
   ```

5. **Define actions**

   For each segment, ask:
   "For segment-<N>, what browser actions should I record?"

   Help them define:
   - Starting URL
   - Clicks, typing, navigation
   - Wait times
   - Key moments to capture

6. **Define title and outro**

   Ask:
   - "What should the title card say?"
   - "Any subtitle/tagline?"
   - "For the outro, what call-to-action?"
   - "Any links to display?"

7. **Generate DEMO_SCRIPT.md**

   Write the complete script following the format in:
   `.claude/skills/mastra-demo/references/script-format-reference.md`

8. **Final validation**

   Read all voiceovers back-to-back and check:
   - Natural transitions
   - No abrupt starts
   - Cohesive story

---

## Validation Mode (--validate)

1. **Read DEMO_SCRIPT.md**
   Parse all sections.

2. **Check structure**
   - [ ] Has Narrative section
   - [ ] Has Settings section
   - [ ] Has at least one Segment
   - [ ] Each segment has url, voiceover, actions

3. **Validate narrative flow**

   Read all voiceovers in sequence.
   Check for:

   **Good transitions** (pass):
   - "Now that we're..."
   - "Here's where..."
   - "Back in..."
   - "Watch as..."

   **Bad patterns** (warn):
   - Abrupt starts without context
   - No connection to previous segment
   - Bullet-point style (not narrative)

4. **Report findings**

   ```
   DEMO_SCRIPT.md Validation
   ─────────────────────────

   Structure: ✓ Valid
   Segments: 5 defined

   Narrative Flow:
   ✓ segment-01-login: Good opening
   ✓ segment-02-admin: Connects with "Now that we're logged in..."
   ⚠ segment-03-change: Starts abruptly - consider adding transition
   ✓ segment-04-denied: Good callback "Back in Mastra Studio..."
   ✓ segment-05-wrapup: Strong closing

   Suggestions:
   - segment-03: Add transition phrase like "Here's where it gets interesting..."

   Overall: Ready to record (1 minor suggestion)
   ```

</process>

<narrative_guidelines>

## Writing Good Narratives

**Start with the full story:**
Write 2-3 paragraphs as if explaining to a colleague. Don't think about segments yet.

**Key elements:**
1. **Hook** - Why should they care?
2. **Setup** - What are we looking at?
3. **Demonstration** - Show the feature working
4. **Contrast** - Show before/after or with/without
5. **Conclusion** - Reinforce the value

**Transition phrases:**
- "Let's start by..." (opening)
- "Notice how..." (calling attention)
- "Now that we've..." (after completing something)
- "Here's where it gets interesting..." (building tension)
- "Back in [location]..." (returning)
- "Watch as..." (before action)
- "That's [feature]..." (closing summary)

## Example Narrative

"This is Mastra Studio with authentication enabled. Notice the sign-in prompt
at the top. Let's authenticate using WorkOS, which gives us enterprise SSO.

After signing in, we're back in the Studio as an admin with full access. I can
open any agent and send messages freely. Watch as I interact with the weather
agent.

Here's where it gets interesting. In the WorkOS dashboard, I'll change my role
from Admin to Viewer. Back in Mastra Studio, the difference is immediate - the
message input is now disabled. The RBAC system enforces permissions at the API
level, so even if someone tried to bypass the UI, the server would reject it.

That's Mastra Auth - enterprise SSO with real-time role enforcement."

</narrative_guidelines>

<success_criteria>
**Interactive mode:**
- [ ] User's goal understood
- [ ] Full narrative approved
- [ ] Segments defined with clear purposes
- [ ] Actions specified for each segment
- [ ] Title and outro defined
- [ ] DEMO_SCRIPT.md written

**Validation mode:**
- [ ] Structure validated
- [ ] Narrative flow checked
- [ ] Issues identified with suggestions
- [ ] Clear report provided
</success_criteria>
