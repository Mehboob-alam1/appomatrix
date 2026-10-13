# Deploy Appo Matrix on Hostinger

This app is a Next.js server. It needs a Node.js application and a MySQL database. Uploads must live outside the folder Hostinger replaces when you redeploy.

No production credentials are stored in the repository. Create the database in hPanel first. Migrations only create missing tables and columns. They do not drop tables or overwrite existing rows.

## 1. Create the MySQL database

In hPanel, open **Databases → MySQL Databases**.

1. Create the database. hPanel prefixes the name, so the suffix `appomatrix` becomes `u276950232_appomatrix`.
2. Create the user with the same suffix, `u276950232_appomatrix`, set a password, and assign that user to this database with all privileges.
3. On the same Hostinger server use host `localhost` and port `3306`. If you connect remotely and Hostinger requires TLS, set `DB_SSL=true`.

Use these environment values:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=u276950232_appomatrix
DB_NAME=u276950232_appomatrix
DB_PASSWORD=the password chosen in hPanel
```

The database can be empty. If it already contains the tables in `db/schema.sql`, the app keeps that data and only adds missing columns.

## 2. Create the Node.js app

In hPanel, open **Advanced → Node.js** (or the Node.js web app tool).

- Node.js 20 or newer
- Application root: the deployed project directory
- Start command: `npm start`
- Hostinger sets `PORT`. The start script uses that port.

Build command, if the panel asks for one:

```bash
npm install
npm run build
```

## 3. Environment variables

Set these in the Node.js app environment, not in a committed file:

| Variable | Purpose |
| --- | --- |
| `DB_HOST` | MySQL host from hPanel |
| `DB_PORT` | Usually `3306` |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password. Set it even if you later rotate it. |
| `DB_NAME` | Database name |
| `DB_SSL` | `true` only when the host requires TLS |
| `AUTH_SECRET` | A random string of at least 32 characters. Required in production. |
| `ADMIN_USERNAME` | First admin username, used only when the users table is empty |
| `ADMIN_PASSWORD` | First admin password, used only when the users table is empty |
| `NEXT_PUBLIC_SITE_URL` | Public origin, such as `https://appomatrix.com`, with no trailing slash |
| `UPLOAD_DIR` | Absolute path outside the app directory, such as `/home/USER/appomatrix-uploads` |

`ADMIN_USERNAME` and `ADMIN_PASSWORD` are read once, when no admin user exists. Changing them later does not reset the password. Change the password in **Admin → Settings** after the first sign-in.

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Migrations

Migrations run when the server handles its first database request. You do not run a separate destructive migration command.

They apply `db/schema.sql` with `CREATE TABLE IF NOT EXISTS`, then add any missing columns listed in `lib/migrate.ts`. A `seeded` setting prevents sample content from being inserted again. Sample content is inserted only when the services table is empty. Navigation, categories, homepage sections, and page SEO are inserted with `INSERT IGNORE`, so existing rows with the same ids are left alone.

Check the connection after deploy:

```bash
curl -sS https://your-domain/api/health
```

`{"ok":true,"data":{"database":"up"}}` means MySQL is reachable.

## 5. Persistent uploads

Set `UPLOAD_DIR` to a directory that redeploys do not delete, then create it and make it writable by the Node user:

```bash
mkdir -p /home/USER/appomatrix-uploads
```

The app stores files there and serves them at `/uploads/<generated-name>`. Filenames are generated. Original names are not used on disk. JPG, PNG, WEBP, and GIF files up to 5 MB are accepted.

If `UPLOAD_DIR` is left empty, files go to `data/uploads` inside the project. That survives a process restart, but a Hostinger redeploy that replaces the application directory can delete it. Use an external directory in production.

## 6. Restart and redeploy

After changing environment variables or pulling new code:

```bash
npm install
npm run build
```

Restart the Node.js app from hPanel. The next request runs the safe migration again.

## 7. Backup and restore

Back up the database and the upload directory. Do not commit dumps or production uploads.

Database backup from the server:

```bash
mysqldump --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password="$DB_PASSWORD" --single-transaction --routines=false "$DB_NAME" > appomatrix-$(date +%F).sql
```

Restore into an existing database:

```bash
mysql --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password="$DB_PASSWORD" "$DB_NAME" < appomatrix-2026-10-12.sql
```

Uploads:

```bash
tar -czf appomatrix-uploads-$(date +%F).tar.gz -C /home/USER appomatrix-uploads
tar -xzf appomatrix-uploads-2026-10-12.tar.gz -C /home/USER
```

Restore the database first, then the upload directory, then restart the app. Image paths stored in MySQL are `/uploads/<filename>`, so the filenames in the archive must match.

## 8. What you must provide for production

The repository does not contain a Hostinger dump or hosting config. Before pointing this app at a database that was **not** created by this schema, send:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` through the host environment, not chat logs if you can avoid it
- Whether TLS is required
- The output of `SHOW TABLES` and `SHOW CREATE TABLE` for every existing table, if the database is not empty
- The absolute path to use for `UPLOAD_DIR`
- The public site URL
- A new `AUTH_SECRET`

If those tables do not match `db/schema.sql`, do not run the app against that database until the column names are confirmed. The migrator will not drop them, but queries expect the columns in that file.
