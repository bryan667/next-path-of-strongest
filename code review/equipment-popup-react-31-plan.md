# Equipment popup React error #31: review and implementation plan

Date: 2026-10-18
Status: implemented, reviewed, and verified

## Reported behavior and acceptance criteria

Entering an account loads characters. Selecting a character displays its equipment grid. Hovering equipment should display the details popup, but production React throws error #31 for an object with the key `description`.

The fix must:

1. Render equipment descriptions supplied as either strings or `{ description: string }` objects.
2. Cover enchant, implicit, utility, and explicit modifier sections consistently.
3. Keep existing names, base types, properties, requirements, colors, ordering, spacing, and floating positioning working.
4. Avoid passing unsupported API objects to React children or showing `[object Object]`.
5. Preserve hidden-until-hover behavior and the existing click toggle.
6. Include a regression that fails with the original component and passes with the fix.
7. Leave account fetching, caching, credentials, and unrelated UI behavior outside this change.

## Review findings

### Primary defect: API objects rendered as children

`components/EquipPopupDetails.tsx` maps `enchantMods`, `implicitMods`, `utilityMods`, and `explicitMods` and inserts each entry directly inside a `<div>`. The entire equipment object and all map entries are typed with `any`, so TypeScript cannot detect object children.

The reported production error explicitly identifies an object containing `description`. This is consistent with structured modifier entries reaching those render sites. The exact live item payload has not been captured, so structured modifiers are a strong diagnosis from the code and error rather than a confirmed upstream response sample.

React's official error reference confirms #31 means an object was supplied as a React child: https://react.dev/errors/31.

### Adjacent render boundaries

`equip.name` and `equip.baseType` are also rendered directly. Property and requirement values are interpolated, which avoids this React exception but can display `[object Object]` for malformed values. Handle text boundaries consistently without changing the supported property display modes.

### Existing interaction and test infrastructure

`EquipIcon.tsx` owns hover/click state and Floating UI refs/styles. `EquipmentGrid.tsx` passes the selected item through without normalizing it. The failure occurs only when the popup body mounts, explaining the hover trigger. Keep this interaction intact.

The repository already has Jest, `next/jest`, React DOM, and a jsdom environment package. Existing tests cover API routes only. Add focused component regression coverage without new dependencies.

### Baseline constraints

No applicable AGENTS.md was found in the repository or checked ancestor directories. The working tree was initially clean. `node_modules` was absent. Node is v22.15.0. PowerShell blocks `npm.ps1`, so use `npm.cmd`/`npx.cmd`.

OpenCode is installed at `C:\opencode\opencode.exe`, but its help commands failed at startup with `EEXIST` while creating `C:\Users\bryan\.config\opencode`. Use an available coding agent for this fix. The optional DeepSeek credential file does not need to be read or copied.

## Implementation design

### 1. Normalize API text at the component boundary

- Introduce a small pure helper, local to the component unless reuse becomes necessary.
- Accept `unknown`, returning renderable text only.
- Preserve strings and numbers, including zero where appropriate.
- For a non-null object with a `description` field, extract that field only when it is a supported scalar.
- Return an empty string for null, booleans, arrays, unknown object shapes, or malformed descriptions.
- Do not blindly stringify unknown objects, inject HTML, or recursively traverse arbitrary payloads.
- Treat text as regular React text children so normal escaping remains in effect.

### 2. Apply safe rendering consistently

- Normalize modifier entries in all four existing modifier sections.
- Keep the original section sequence and class names.
- Omit unusable entries rather than rendering object representations.
- Guard section iteration with `Array.isArray` where needed, since optional chaining alone does not validate `.map`.
- Normalize name/base-type text and property/requirement scalar values without expanding property display-mode support.
- Replace relevant `any` usage with `unknown` and narrow local types where practical. Avoid broad unrelated type refactors in parent components.
- Retain Floating UI refs, styles, and hover gating.

### 3. Regression tests

Add `__tests__/equip-popup-details.test.tsx` (or equivalent focused test file) using existing Jest and React DOM tools.

Required cases:

- A visible popup accepts an object `{ description: '+25 to maximum Life' }` in each of the four modifier arrays, renders its text, and does not throw.
- Existing plain-string modifier entries still render in their original order and sections.
- Mixed string/object modifier arrays render correctly.
- Null, unsupported objects, malformed descriptions, and missing modifier arrays do not crash or display `[object Object]`.
- A hidden popup produces no tooltip even when the equipment contains structured modifiers.
- Equipment name, base type, supported properties, and requirements remain visible.
- If feasible using jsdom and a small Floating UI mock, exercise actual mouse enter/leave and click through `EquipIcon`. Do not introduce a new browser-testing dependency for this fix.

Use meaningful DOM/markup assertions rather than testing the helper in isolation. First run a regression against the original component to demonstrate the reported failure. Then apply the component fix and rerun it.

## Files and ownership

- Architect: this review/plan, final diff review, verification, and recorded results.
- Coding agent: `components/EquipPopupDetails.tsx` and focused component regression tests only.
- Parent components should change only if a concrete integration problem is demonstrated.
- Do not edit API routes, package versions/lockfile, `.env` files, or deployment configuration.

## Validation sequence

1. Install the locked dependencies with `npm.cmd ci`.
2. Demonstrate that the new structured-modifier regression fails against the original component.
3. Run the focused component suite after implementing the fix.
4. Run all existing Jest tests with `npm.cmd test -- --runInBand`.
5. Run TypeScript with `npx.cmd tsc --noEmit --incremental false`.
6. Run targeted ESLint on changed TypeScript files; distinguish unrelated repository lint debt if full lint is also run.
7. Attempt a production build if the environment permits. Report missing secrets, external resources, or sandbox limitations precisely.
8. Review `git diff --check`, final diff, and working-tree scope.

## Risks and limits

- The exact live API response is unavailable; synthetic fixtures will match the reported `{ description }` shape and existing string format.
- Unsupported structures intentionally yield no text. Do not claim arbitrary upstream schemas are supported.
- Full account-to-character live verification may require the user's private application environment variables. Unit/component coverage must work without those credentials.
- Existing route typing/lint problems discovered by broad validation should be reported separately and not folded into this popup fix.

## Implementation and verification record

### Completed implementation

- Saved this plan before delegating implementation to a coding agent.
- Updated only `components/EquipPopupDetails.tsx` and added `__tests__/equip-popup-details.test.tsx`.
- Added guarded text/collection normalization with `unknown` instead of untyped render values.
- The four modifier sections accept both existing strings and structured description objects, preserve ordering/colors, and omit unsupported entries.
- Header, property, and requirement text also pass through safe scalar rendering. Numeric zero is retained.
- Kept the Floating UI callback and styles, with direct callback destructuring to avoid the React refs lint rule treating the callback collection as a mutable ref.
- No application credentials or optional DeepSeek tokens were read. OpenCode remained unavailable due to its startup error, so an available coding agent performed the implementation.

### Regression evidence

After installing dependencies, the coding agent saved the fixed component in memory, temporarily restored the original component from Git, and ran the four structured-description cases. All four failed with the exact reported message: `Objects are not valid as a React child (found: object with keys {description})`. A `finally` block restored the fixed component.

The fixed focused suite passed all 12 cases, including the actual `EquipIcon` mouse enter/leave and click handlers with Floating UI mocked. These tests exercise browser DOM behavior in jsdom; they do not verify Floating UI geometry or a live Path of Exile account response.

### Validation results

- `npm.cmd ci --no-audit --no-fund`: passed after sandbox approval for access to npm's cache; 609 locked packages installed. No package/lockfile edits.
- Original structured-description regression: 4 failed as expected, 8 unrelated cases skipped.
- Fixed focused component suite: 12 passed.
- `npm.cmd test -- --runInBand`: all 3 suites and 20 tests passed.
- `npx.cmd tsc --noEmit --incremental false`: passed.
- `npm.cmd run build`: passed; production compilation, TypeScript, and static page generation completed.
- `npx.cmd eslint components/EquipPopupDetails.tsx __tests__/equip-popup-details.test.tsx`: passed. Targeted ESLint initially flagged the Floating UI callback collection as ref access; callback destructuring addressed that finding without disabling the rule.
- Re-ran all 20 tests and the production build after the final callback adjustment: both passed.
- `git diff --check`: passed.

No live account session was exercised. The production build and synthetic fixtures require no private application keys.
