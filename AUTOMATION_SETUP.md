# Automatic updates and email notifications

The `Sync JW.org content` GitHub Action checks JW.org at 7 and 37 minutes past every hour. It updates Supabase and sends an email only when it finds an item that has never been stored before.

## Required GitHub secrets

Open the repository on GitHub, then go to **Settings > Secrets and variables > Actions** and add these repository secrets:

- `SUPABASE_SECRET_KEY`: Create a dedicated secret key in **Supabase > Project Settings > API Keys**. Do not use the public key from the app.
- `RESEND_API_KEY`: Create an API key in Resend.
- `RESEND_FROM_EMAIL`: Optional. Use `JW Track <onboarding@resend.dev>` while testing. After verifying a domain in Resend, use an address on that domain.

Do not put any of these values in a file or commit them to GitHub.

## First test

In GitHub, open **Actions > Sync JW.org content > Run workflow**, enable the dry-run option, and run it. A successful dry run reads JW.org and Supabase without changing content or sending email.

Run it again with dry-run disabled after the secrets are configured. Signed-in users control delivery from the email-notification switch in the account sheet. Existing database items do not generate an email; the next newly published item will.
