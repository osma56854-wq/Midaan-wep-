# MIDAAN | Industrial Operations Network

MIDAAN connects industrial technicians, engineers, factories, and suppliers through organization workspaces, verified practical skills, machine records, maintenance workflows, fault reports, a supplier marketplace, RFQs, and a product catalog.

**Live application:** https://osma56854-wq.github.io/Midaan-wep-/

## Product modules

- **Organizations & teams:** create a factory workspace, manage active members, roles, and invitation codes.
- **Skills & evidence:** document work procedures, steps, safety level, and supporting media for review.
- **Machines:** maintain an organization-scoped machine register.
- **Maintenance:** schedule, assign, track, and repeat maintenance tasks.
- **Fault reports:** record machine faults and track their status.
- **Industrial marketplace:** publish supplier offers and submit service/product requests.
- **RFQs & quotes:** publish requests for quotation and manage supplier responses.
- **Product catalog:** publish industrial products with images and seller information.
- **Account settings:** profile, password recovery, Arabic/English interface, and light/dark themes.

## Technology and cost constraints

- Static frontend hosted on GitHub Pages.
- Supabase Auth, Postgres, Storage, and Edge Functions.
- The project is maintained for the Supabase Free tier; do not enable paid add-ons or upgrade plans without an explicit business decision.
- Never put a Supabase service-role key or other server secret in frontend code. The browser may use only the project's publishable/anon key.

## First-time use

1. Open the live application using the link above.
2. Create an account and complete any email confirmation requested by Supabase Auth.
3. Sign in, create your first organization, and choose the relevant industry/country details.
4. Add machines and team members before assigning work.
5. Start with a small pilot: one organization, two user accounts, one machine, one skill record, one maintenance task, and one product listing.
6. Use the in-app Settings page to set language and theme.

Invitation codes are currently copied and shared by the organization owner/admin; MIDAAN does not send invitation emails automatically.

## Developer validation

The repository's GitHub Actions validation workflow runs JavaScript syntax checks and the Node test suite:

```bash
node --check app.js
node --check skill-upload-utils.js
node --check sw.js
node --test tests/*.test.cjs
```

Deployment to GitHub Pages is triggered by changes merged into `main`.

## Operational readiness

A passing automated test suite is not the same as a completed live acceptance test. Before onboarding real factories, complete the two-account permission checks, file upload checks, email recovery checks, and the database migration-history reconciliation in [Production readiness checklist](docs/production-readiness.md).

## Safety and data handling

MIDAAN is an operational record-keeping tool, not a substitute for manufacturer instructions, lockout/tagout, risk assessment, or approved factory safety procedures. Users must have qualified personnel review technical procedures before use.
