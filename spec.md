# MedInfo

## Current State
App uses the `authorization` Caffeine component. Admin check via `AccessControl.isAdmin`. No admin exists in the deployed canister, so all logged-in users see "Access Denied" on the admin page. There is no way to self-assign admin.

## Requested Changes (Diff)

### Add
- `claimAdmin` backend function: if no admin exists, caller becomes admin
- `hasAnyAdmin` backend query: returns bool so frontend knows whether to show claim button
- "Claim Admin" UI section in AdminPage for authenticated non-admin users when no admin exists

### Modify
- AdminPage: show claim button when user is logged in but not admin and no admin exists yet

### Remove
- Nothing

## Implementation Plan
1. Add `hasAnyAdmin` query and `claimAdmin` mutation to main.mo
2. Regenerate backend bindings
3. Add useHasAnyAdmin and useClaimAdmin hooks to useQueries
4. Update AdminPage to show Claim Admin UI for the first-user scenario
