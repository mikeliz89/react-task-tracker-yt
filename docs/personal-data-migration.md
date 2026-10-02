# Personal data migration

The app now reads Realtime Database records from `/users/<Firebase Auth UID>/...`. The matching database rules deny access to the old shared root collections. Prepare and import user data before deploying the app and rules together.

1. Export a fresh Realtime Database backup. Keep it outside the repository and retain the original as a rollback copy.
2. Create a private JSON file mapping each `createdBy` email in that export to its Firebase Authentication UID:

   ```json
   { "person@example.com": "firebase-auth-uid" }
   ```

3. Prepare a root-level update containing the `users` key and an unresolved-record report:

   ```sh
   node scripts/migrate-user-data.js backup.json email-to-uid.json users.json unresolved.json
   ```

   The command exits with code 2 when any record still needs review. Its output has the shape `{ "users": { "<uid>": { ... } } }`.

4. Review each unresolved record against the original backup. For records with no reliable creator, write a private owner override file with section and record ID keys:

   ```json
   { "tasklists": { "old-list-id": "firebase-auth-uid" } }
   ```

   Rerun the command with the override file as the fifth argument. Assigning a parent record also assigns its related child collection. Do not import until the unresolved report is empty or every remaining omission is intentional.

5. Apply `users.json` as an update at the database root using an administrator account:

   ```sh
   firebase database:update / users.json --project lifesaver-production-new
   ```

   This replaces the root `users` child while retaining unrelated root children. Do not use `database:set /` for this file; that would replace the entire database root. Verify two different test accounts can see only their own records. Deploy the new app, Realtime Database rules, and Storage rules as one release. Old root records can be retained in the private backup and removed after verification.

Existing Firebase Storage image objects also need to be copied from their old root paths into `/users/<uid>/...` and the image URLs in migrated records updated. The new rules deny SDK access to root objects. Existing Firebase download URLs may remain usable by anyone holding the URL until their download tokens are revoked or the old objects are deleted. Profile avatars use `/users/<uid>/avatar.png` for new uploads.

Keep the backup, UID map, override file, generated user data, and unresolved report out of source control because they contain personal data.
