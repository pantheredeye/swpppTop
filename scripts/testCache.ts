// scripts/testCache.js
import { cacheClient } from 'api/src/lib/cache'

export default async () => {
  console.log(':: Executing Cache Test ::');

  try {
    // Use cacheClient for direct Redis operations
    console.log('Testing SET operation...');
    await cacheClient.set('test-key', 'test-value', { expires: 60 });
    console.log('SET completed');

    console.log('Testing GET operation...');
    const value = await cacheClient.get('test-key');
    console.log('GET completed. Value:', value);
  } catch (error) {
    console.error('Cache test failed!', error);
  }
};
