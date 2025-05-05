package ro.pizzeriaq.qservices.data.cache;

public class ThreadSafeLRUCache<K, V> extends SimpleLRUCache<K, V> {

	private final Object lock;


	public ThreadSafeLRUCache(int maxSize) {
		super(maxSize);
		lock = new Object();
	}


	@Override
	public int size() {
		synchronized (lock) {
			return super.size();
		}
	}

	@Override
	public V get(K key) {
		synchronized (lock) {
			return super.get(key);
		}
	}

	@Override
	public void put(K key, V data) {
		synchronized (lock) {
			super.put(key, data);
		}
	}

	@Override
	public boolean containsKey(K key) {
		synchronized (lock) {
			return super.containsKey(key);
		}
	}

	@Override
	public V remove(K key) {
		synchronized (lock) {
			return super.remove(key);
		}
	}
}
