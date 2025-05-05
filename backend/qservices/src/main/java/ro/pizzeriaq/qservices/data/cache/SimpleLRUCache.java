package ro.pizzeriaq.qservices.data.cache;

import java.util.LinkedHashMap;
import java.util.Map;

public class SimpleLRUCache<K, V> implements LRUCache<K, V> {

	private final Map<K, V> cache;


	public SimpleLRUCache(int maxSize) {
		this.cache = new LinkedHashMap<>(maxSize, 0.75f, true) {
			@Override
			protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
				return size() > maxSize;
			}
		};
	}


	@Override
	public int size() {
		return cache.size();
	}

	@Override
	public V get(K key) {
		return cache.get(key);
	}

	@Override
	public void put(K key, V data) {
		cache.put(key, data);
	}

	@Override
	public boolean containsKey(K key) {
		return cache.containsKey(key);
	}

	@Override
	public V remove(K key) {
		return cache.remove(key);
	}
}
