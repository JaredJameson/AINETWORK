export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { runScan } = await import('./lib/scanner');

    // Monday and Thursday at 8:00 AM
    cron.default.schedule('0 8 * * 1,4', async () => {
      console.log('[Scanner] Starting scheduled news scan...');
      try {
        const result = await runScan();
        console.log(`[Scanner] Done: ${result.drafts} new drafts from ${result.scanned} sources`);
      } catch (err) {
        console.error('[Scanner] Error:', err);
      }
    });

    console.log('[Scanner] Cron scheduled (Mon + Thu 8:00)');
  }
}
