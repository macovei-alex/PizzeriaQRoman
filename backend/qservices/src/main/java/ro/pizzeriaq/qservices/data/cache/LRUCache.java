package ro.pizzeriaq.qservices.data.cache;

public interface LRUCache<K, V> {
	int size();
	V get(K key);
	void put(K key, V data);
	boolean containsKey(K key);
	V remove(K key);
}
