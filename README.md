# LRU cache

## What is LRU cache?
LRU cache is a data structure that organizes data by access order. The most recently created and most accessed data stay in the front of the cache. The least accessed data gets pushed behind and eventually out of the cache as new data is added.

LRU cache is optimized for quick data access. It contains a map of keys pointing to its data. Given a valid key, the cache returns the data in O(1) time. It is also optimized for space. Imagine the cache lives in a space where it can only hold so much data. The cache wants to keep the most accessed data and tosses away the least accessed data. LRU gives you that. LRU accepts a capacity parameter to limit the amount of data it can keep.

## How to use?
Example:
const cache = new LruCache<string, string>(100);

Explanation:
The code creates a cache instance with a capacity of 100. 100 is the max number of keys the cache can hold. The key will be of type string and the value will be of type string. To take new data, it must get rid of some old ones. At the end, the max size will remain 100, given the capacity remains constant.

Other examples
- LruCache<string, int>(N)
- LruCache<int, int>(N)
- LruCache<int, boolean>(N)
- LruCache<string, CustomType>(N)

* Min capacity is 1 if smaller than 1 capacity is given.
* Default capacity will be used if no capacity is specified

## Methods
put(key, value)
- Add an item to the cache

get(key)
- Get the item associated with the key from the cache. Return undefined if key is invalid or no data is found

init()
- Reinitialize the cache

clear()
- Remove all items from the cache.

isFull()
- Returns true if size equals to capacity

getMruValue()
- Get the most recently used value from cache

getLruValue()
- Get the least recently used value from cache



