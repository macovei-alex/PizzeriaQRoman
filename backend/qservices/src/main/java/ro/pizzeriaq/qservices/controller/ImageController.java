package ro.pizzeriaq.qservices.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.pizzeriaq.qservices.service.DTO.ImageDTO;
import ro.pizzeriaq.qservices.service.DTO.ProductDTO;
import ro.pizzeriaq.qservices.service.ImageManagementService;
import ro.pizzeriaq.qservices.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/image")
public class ImageController {

	private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
	private final ImageManagementService imageManagementService;
	private final ProductService productService;


	public ImageController(ImageManagementService imageManagementService, ProductService productService) {
		this.imageManagementService = imageManagementService;
		this.productService = productService;
	}


	@GetMapping("/all")
	public List<ImageDTO> getImages() {
		List<ProductDTO> products = productService.getProducts();
		return products.stream()
				.peek(product -> {
					if (!imageManagementService.imageExists(product.getImageName())){
						logger.error("Image ( {} ) not found for ( {} )", product.getImageName(), product.getName());
					}
				})
				.filter((product) -> imageManagementService.imageExists(product.getImageName()))
				.map(product -> new ImageDTO(
						product.getImageName(),
						imageManagementService.readImageBase64(product.getImageName())
				))
				.toList();
	}


	@GetMapping("/changes/{timestamp}")
	public boolean checkForChanges(@PathVariable String timestamp) {
		// TODO: Implement this method
		return timestamp.equals("yes");
	}
}
