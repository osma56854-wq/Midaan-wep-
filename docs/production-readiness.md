# MIDAAN — Production readiness checklist

Last reviewed: 11 November 2026

## Current deployment

- Frontend: https://osma56854-wq.github.io/Midaan-wep/
- Repository: https://github.com/osma56854-wq/Midaan-wep-
- Supabase project: `midaan` (`lkofveroqcrfehczdlkl`)
- Latest inspected GitHub Pages deployment workflow completed successfully.
- Latest inspected validation workflow completed successfully; the Node test output reported 53 passing tests and 0 failures.
- Product image upload retry, module-load error isolation, and maintenance assignee selection are present in the deployed code line.

## What has been verified

- The frontend contains 11 main application views.
- Static DOM reference check: no missing IDs referenced by `app.js`, and no duplicate HTML IDs were found.
- The repository has automated tests for navigation, skill upload utilities, maintenance, marketplace, RFQs, team management, and catalog behavior.
- The inspected database had RLS enabled on all 20 public tables at the time of the previous audit.
- Maintenance task assignment checks that the assignee is an active member of the same organization.
- The team member RPC returns `member_user_id`, `display_name`, `role`, `status`, and `joined_at`; the maintenance selector uses those fields.
- Product image retry reuses the saved product record; it does not insert a second product row.

## Not yet verified in a real browser session

These checks require signing in with real, separate test accounts and exercising the live application. Static tests cannot prove them:

- [ ] Sign up, email confirmation, sign in, sign out, and password recovery.
- [ ] Create an organization as account A.
- [ ] Invite account B, copy the invitation code, and accept it while signed in as B.
- [ ] Verify owner/admin/engineer/technician/reviewer permissions with the correct role for each action.
- [ ] Confirm account B cannot read or change another unrelated organization's private records.
- [ ] Create a machine, skill with evidence, fault report, and maintenance task.
- [ ] Assign a maintenance task to another active member in the same organization.
- [ ] Complete a recurring maintenance task and confirm exactly one next occurrence is created.
- [ ] Upload and open permitted evidence file types; verify rejected file types and oversize files show clear errors.
- [ ] Publish a product with an image, force an upload failure, and retry without creating a duplicate product.
- [ ] Create a marketplace offer, submit a request, create an RFQ, submit a quote, and update quote status using the intended roles.
- [ ] Verify Arabic/English, light/dark mode, and narrow Android screen layouts.
- [ ] Confirm no private storage object can be accessed without an authorized signed URL.

## Supabase items requiring attention

### 1. Migration history drift — do not run `db push` or migration repair blindly

The remote Supabase migration ledger currently contains 22 entries. The repository currently contains 16 SQL migration files. The repository has consolidated/local timestamped files for some rate-limit work, while the remote ledger includes six separate rate-limit entries and two skill-governance entries that are not present as standalone files in the current repository. Two local migration files also have timestamps not present as remote ledger entries.

The current database contains relevant security/rate-limit and skill-governance objects, but that does not prove the exact original SQL or migration ordering. Reconcile the original SQL from trusted Git history/backup and compare every affected object before changing migration history. Do not create empty placeholder migrations, invent historical SQL, or use `supabase migration repair` as a substitute for verifying schema state. Do not run `db push` until this reconciliation is complete.

### 2. Leaked-password protection

The Supabase Security Advisor reported **Leaked Password Protection Disabled**. Enable it in Supabase Auth password/security settings before broad public onboarding. The frontend's password check is only a supplementary control and does not replace the Auth-side protection.

### 3. Unused indexes

The Performance Advisor reported 32 indexes as unused at the time of review. This is informational for a young/low-traffic database. Do not drop them solely because the advisor reports zero observed usage; first collect representative workload data and review each index's query and constraint purpose.

### 4. Storage

Current buckets reviewed:
- `skill-evidence`: private, with configured size/type limits.
- `industrial-products`: public product-image bucket, with configured size/type limits.

Validate the intended public/private access behavior using separate authenticated accounts before production onboarding.

## Invitation and email behavior

Organization invitation creation currently returns a code that the owner/admin must copy and share manually. The app does not send invitation emails automatically. Password recovery email was previously tested by the project owner, but the complete sign-up/confirmation/recovery cycle still needs a fresh acceptance test after the latest deployment.

## Safe release procedure

1. Complete the browser acceptance checklist with two separate test accounts.
2. Resolve migration-history drift using verified original SQL and a backup.
3. Enable leaked-password protection in Supabase Auth.
4. Re-run GitHub Actions and Supabase security/performance advisors.
5. Confirm the Free plan remains sufficient for the expected pilot workload and limits.
6. Only then decide whether to onboard real organizations. Do not upgrade billing or enable paid add-ons without explicit approval.

## Current status

**Deployed pilot build — not yet certified for unrestricted production onboarding.** The application is live and automated checks pass, but tenant-isolation and end-to-end workflows still require real authenticated browser testing, and migration history must be reconciled before future schema deployment.
