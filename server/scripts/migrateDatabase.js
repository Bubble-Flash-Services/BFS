import 'dotenv/config';
import { MongoClient } from 'mongodb';

// Helper to parse DB name from URI if present; otherwise use provided default
function getDbName(uri, fallback) {
  try {
    const afterAt = uri.split('@')[1] || '';
    const path = afterAt.split('/')[1] || '';
    const dbSegment = path.split('?')[0];
    if (dbSegment) return dbSegment;
  } catch {}
  return fallback || 'test';
}

async function cloneIndexes(oldCol, newCol) {
  try {
    const indexes = await oldCol.indexes();
    for (const idx of indexes) {
      if (idx.name === '_id_') continue; // default index
      const keys = idx.key;
      const { name, unique, sparse, expireAfterSeconds, partialFilterExpression, collation } = idx;
      try {
        const options = { name };
        if (unique) options.unique = true;
        if (sparse) options.sparse = true;
        if (typeof expireAfterSeconds === 'number') options.expireAfterSeconds = expireAfterSeconds;
        if (partialFilterExpression && typeof partialFilterExpression === 'object') {
          options.partialFilterExpression = partialFilterExpression;
        }
        if (collation && typeof collation === 'object') {
          options.collation = collation;
        }
        await newCol.createIndex(keys, options);
      } catch (e) {
        // Ignore index errors (e.g., already exists)
        console.warn(`Index create warn on ${newCol.collectionName}/${name}:`, e.message);
      }
    }
  } catch (e) {
    console.warn(`Failed to clone indexes for ${oldCol.collectionName}:`, e.message);
  }
}

async function migrate() {
  const OLD_URI = process.env.MONGO_URI_OLD;
  const NEW_URI = process.env.MONGO_URI || process.env.MONGO_URI_NEW;
  const DB_NAME_OLD = process.env.MONGO_DB_NAME_OLD || process.env.MONGO_DB_NAME;
  const DB_NAME_NEW = process.env.MONGO_DB_NAME_NEW || process.env.MONGO_DB_NAME;

  if (!OLD_URI) throw new Error('MONGO_URI_OLD not set');
  if (!NEW_URI) throw new Error('MONGO_URI (new) not set');

  const oldDbName = DB_NAME_OLD || getDbName(OLD_URI, 'test');
  const newDbName = DB_NAME_NEW || getDbName(NEW_URI, oldDbName);

  console.log('— Database Migration —');
  console.log('Source:', OLD_URI.replace(/:\w+@/, '://****@'), 'DB:', oldDbName);
  console.log('Target:', NEW_URI.replace(/:\w+@/, '://****@'), 'DB:', newDbName);

  const oldClient = new MongoClient(OLD_URI, { maxPoolSize: 10 });
  const newClient = new MongoClient(NEW_URI, { maxPoolSize: 10 });

  const start = Date.now();
  try {
    await Promise.all([oldClient.connect(), newClient.connect()]);
    const oldDb = oldClient.db(oldDbName);
    const newDb = newClient.db(newDbName);

    const collections = await oldDb.listCollections({}, { nameOnly: true }).toArray();
    const filtered = collections.filter(c => !c.name.startsWith('system.'));
    console.log(`Found ${filtered.length} collections to migrate.`);

    for (const { name } of filtered) {
      console.log(`\n→ Migrating collection: ${name}`);
      const oldCol = oldDb.collection(name);
      const newCol = newDb.collection(name);

      // Ensure indexes first
      await cloneIndexes(oldCol, newCol);

  const batchSize = Number(process.env.MIGRATE_BATCH_SIZE || 1000);
  const cursor = oldCol.find({}).batchSize(Math.min(batchSize, 1000));
      let batch = [];
      let count = 0;
  const BATCH_SIZE = batchSize;

      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        batch.push({
          replaceOne: {
            filter: { _id: doc._id },
            replacement: doc,
            upsert: true
          }
        });
        if (batch.length >= BATCH_SIZE) {
          const res = await newCol.bulkWrite(batch, { ordered: false });
          count += res.upsertedCount + res.modifiedCount + res.matchedCount;
          batch = [];
          process.stdout.write(`... ${count} docs processed\r`);
        }
      }
      if (batch.length) {
        const res = await newCol.bulkWrite(batch, { ordered: false });
        count += res.upsertedCount + res.modifiedCount + res.matchedCount;
      }
      console.log(`Done. ${count} documents migrated.`);
    }

    console.log(`\n✔ Migration complete in ${(Date.now() - start) / 1000}s`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await Promise.allSettled([oldClient.close(), newClient.close()]);
  }
}

migrate();
