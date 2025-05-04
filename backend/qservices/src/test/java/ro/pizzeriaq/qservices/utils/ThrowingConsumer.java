package ro.pizzeriaq.qservices.utils;

@FunctionalInterface
public interface ThrowingConsumer<T> {
	void consume(T value) throws Exception;
}
