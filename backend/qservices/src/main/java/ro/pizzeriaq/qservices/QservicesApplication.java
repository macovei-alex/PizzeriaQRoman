package ro.pizzeriaq.qservices;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.data.repository.ProductCategoryRepository;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class QservicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(QservicesApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedHeaders("*")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
			}
		};
	}

	/*
	@Bean
	@Transactional
	public CommandLineRunner addProducts(ProductRepository productRepository, ProductCategoryRepository categoryRepository) {
		return (_) -> {
			productRepository.deleteAll();
			categoryRepository.deleteAll();

			List<ProductCategory> categories = new ArrayList<>();
			categories.add(new ProductCategory(null, new ArrayList<>(), "Cele mai vandute mai vandute"));
			categories.add(new ProductCategory(null, new ArrayList<>(), "Pizza 1+1 combo"));
			categories.add(new ProductCategory(null, new ArrayList<>(), "Pizza 30 cm"));
			categories.add(new ProductCategory(null, new ArrayList<>(), "Fa-ti singur pizza"));
			categories.add(new ProductCategory(null, new ArrayList<>(), "Bauturi non-alcoolice"));

			categories = categoryRepository.saveAll(categories);

			List<Product> products = new ArrayList<>();
			products.add(new Product(null, categories.get(0), List.of(), List.of(), List.of(), "Pizza Taraneasca", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(30.0), "", true));
			products.add(new Product(null, categories.get(0), List.of(), List.of(), List.of(), "Pizza Margherita", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(40.0), "", true));
			products.add(new Product(null, categories.get(0), List.of(), List.of(), List.of(), "Pizza Quattro Stagioni", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(50.0), "", true));
			products.add(new Product(null, categories.get(1), List.of(), List.of(), List.of(), "Pizza Capriciosa", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(60.0), "", true));
			products.add(new Product(null, categories.get(1), List.of(), List.of(), List.of(), "Pizza Quattro Formaggi", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(70.0), "", true));

			productRepository.saveAll(products);
		};
	}
	*/
}
