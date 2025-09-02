# Database Migration Scripts

This folder contains utilities to migrate/copy data between MongoDB databases.

Usage:

1) Ensure .env contains both URIs:
- MONGO_URI (new target)
- MONGO_URI_OLD (source)

Optional:
- MONGO_DB_NAME, MONGO_DB_NAME_OLD, MONGO_DB_NAME_NEW (override DB names if URIs don’t specify)
- MIGRATE_BATCH_SIZE (default 1000)

2) Run migration:

npm run migrate

The script copies all collections and documents (upsert by _id) and clones indexes.