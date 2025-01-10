import { cache, deleteCacheKey } from 'api/src/lib/cache'

export default async ({ args }) => {
  try {
    console.log('Starting cache test...')

    // Step 1: Set a value in the cache
    console.log('Setting test value...')
    const testValue = await cache('test-key', () => 'test-value', {
      expires: 3600,
    })
    console.log('Cache set:', testValue)

    // Step 2: Retrieve the cached value
    console.log('Retrieving cached value...')
    const cachedValue = await cache('test-key', () => 'fallback-value')
    console.log('Cached value retrieved:', cachedValue)

    // Step 3: Delete the cache key
    console.log('Deleting test cache...')
    await deleteCacheKey('test-key')
    console.log('Cache key deleted.')

    // Step 4: Verify cache miss
    console.log('Verifying cache miss...')
    const newValue = await cache('test-key', () => 'new-test-value')
    console.log('Value after cache deletion:', newValue)

    console.log('Cache test completed successfully.')
  } catch (error) {
    console.error('Cache test failed:', error)
  }
}
