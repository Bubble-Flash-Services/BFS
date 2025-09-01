import cron from 'node-cron';
import { searchByFolderAndAge, deleteByPublicId } from './cloudinary.js';

export const startCleanupTasks = () => {
  // Run daily at 03:15 server time
  cron.schedule('15 3 * * *', async () => {
    try {
      const folders = ['bfs/attendance', 'bfs/orders'];
      for (const folder of folders) {
        const res = await searchByFolderAndAge({ folder, olderThanDays: 7 });
        const resources = res?.resources || [];
        if (resources.length) {
          console.log(`[Cleanup] Deleting ${resources.length} old images in ${folder}`);
          for (const r of resources) {
            await deleteByPublicId(r.public_id);
          }
        }
      }
    } catch (err) {
      console.error('Cleanup task error:', err.message || err);
    }
  });
};
