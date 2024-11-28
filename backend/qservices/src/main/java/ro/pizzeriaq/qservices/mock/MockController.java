package ro.pizzeriaq.qservices.mock;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/mock")
public class MockController {

	private final AtomicInteger counter = new AtomicInteger(0);

	@GetMapping("/test")
	public String test() {
		System.out.println(counter.incrementAndGet() + "/mock/test");
		return "Test mock endpoint";
	}

	@GetMapping("/product/all")
	public List<MockProductDTO> getProducts() {
		System.out.println(counter.incrementAndGet() + "/mock/product/all");
		List<MockProductDTO> products = new ArrayList<>();
		products.add(new MockProductDTO(1, "Pizza Taraneasca", "1+1 Gratis la alegere", "500g", 30.0, "", 1));
		products.add(new MockProductDTO(2, "Pizza Margherita", "1+1 Gratis la alegere", "500g", 40.0, "", 1));
		products.add(new MockProductDTO(3, "Pizza Quattro Stagioni", "1+1 Gratis la alegere", "500g", 50.0, "", 1));
		products.add(new MockProductDTO(4, "Pizza Capriciosa", "1+1 Gratis la alegere", "500g", 60.0, "", 2));
		products.add(new MockProductDTO(5, "Pizza Quattro Formaggi", "1+1 Gratis la alegere", "500g", 70.0, "", 3));
		return products;
	}

	@GetMapping("/category/all")
	public List<MockCategoryDTO> getCategories() {
		System.out.println(counter.incrementAndGet() + "/mock/category/all");
		List<MockCategoryDTO> categories = new ArrayList<>();
		categories.add(new MockCategoryDTO(1, "Cele mai vandute"));
		categories.add(new MockCategoryDTO(2, "Pizza 1+1 combo"));
		categories.add(new MockCategoryDTO(3, "Pizza 30cm"));
		categories.add(new MockCategoryDTO(4, "Fa-ti singur pizza"));
		categories.add(new MockCategoryDTO(5, "Bauturi non-alcoolice"));
		return categories;
	}
}
