package ro.pizzeriaq.qservices.unit.service;

import org.junit.jupiter.api.Test;
import ro.pizzeriaq.qservices.service.ImageManagementService;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ImageManagementServiceTest {

	private final ImageManagementService imageManagementService = new ImageManagementService();

	@Test
	void imageExists() {
		assertTrue(imageManagementService.imageExists("generic-pizza.jpg"));
	}

	@Test
	void imageNotExists() {
		assertFalse(imageManagementService.imageExists("generic-pizza-not-exists.jpg"));
	}
}
