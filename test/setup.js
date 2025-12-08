import mongoose from 'mongoose';

let mongoServerInstance = null;


export async function startTestDB() {
  if (process.env.SKIP_DB_TESTS === 'true') {
    console.log('[test/setup] SKIP_DB_TESTS=true -> skipping DB startup');
    return null;
  }

  
  throw new Error('startTestDB() called but SKIP_DB_TESTS !== "true". If you want to run DB tests, implement the DB start logic or set SKIP_DB_TESTS=true to bypass.');
}

export async function stopTestDB() {
  if (process.env.SKIP_DB_TESTS === 'true') {
    console.log('[test/setup] SKIP_DB_TESTS=true -> skipping DB teardown');
    return;
  }
  if (mongoServerInstance) {
    try { await mongoose.disconnect(); } catch (e) { /* ignore */ }
  }
}
