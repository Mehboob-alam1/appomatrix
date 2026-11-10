# CRM email inbox

The admin **Email inbox** (`/admin/inbox`) stores conversations in MySQL and can send real replies over SMTP. Website contact form submissions are mirrored into the inbox automatically.

## Outbound SMTP (required to reply)

Set these on the Hostinger Node.js app (and in local `.env` for development):

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello@appomatrix.com
SMTP_PASS=your_mailbox_password
SMTP_FROM=hello@appomatrix.com
```

Use the same mailbox you want customers to see as the sender. `SMTP_FROM` should match an authorized address on that server.

## Optional IMAP sync

To pull messages that arrive in the mailbox (not only contact-form inquiries):

```bash
IMAP_HOST=imap.hostinger.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_USER=hello@appomatrix.com
IMAP_PASS=your_mailbox_password
```

Then use **Sync mail** in the inbox UI. Provider UIDs prevent duplicate imports.

## Behaviour

- Contact form → `inquiries` row + `email_threads` / `email_messages`
- Existing inquiries are backfilled into threads on migrate
- Replies store Message-ID / In-Reply-To / References and mark the inquiry `replied`
- Credentials never ship to the browser; only authenticated admins can call inbox APIs
