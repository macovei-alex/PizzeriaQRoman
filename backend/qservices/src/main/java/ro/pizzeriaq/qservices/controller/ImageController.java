package ro.pizzeriaq.qservices.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/image")
public class ImageController {

	// TODO: make this into a DTO
	public record Image(String name, String data) {
	}


	private final ImageManagementService imageManagementService;

	private final ProductService productService;


	public ImageController(ImageManagementService imageManagementService, ProductService productService) {
		this.imageManagementService = imageManagementService;
		this.productService = productService;
	}


	@GetMapping("/all")
	public List<Image> getImages() {
		List<ProductDTO> products = productService.getProducts();
		return products.stream()
				.filter((product) -> imageManagementService.imageExists(product.getImageName()))
				.map(product -> new Image(
						product.getImageName(),
						imageManagementService.readImageBase64(product.getImageName())
				))
				.toList();
	}


	@GetMapping("/changes/{timestamp}")
	public boolean checkForChanges(@PathVariable String timestamp) {
		// TODO: Implement this method
		return false;
	}
}
