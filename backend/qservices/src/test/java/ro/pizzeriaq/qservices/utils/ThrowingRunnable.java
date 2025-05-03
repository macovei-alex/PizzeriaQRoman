package ro.pizzeriaq.qservices.utils;

@FunctionalInterface
public interface ThrowingRunnable {
	void run() throws Exception;
}
