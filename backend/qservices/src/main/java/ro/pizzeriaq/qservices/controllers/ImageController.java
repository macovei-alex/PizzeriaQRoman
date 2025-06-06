package ro.pizzeriaq.qservices.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pizzeriaq.qservices.services.ImageService;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
public class ImageController {

	private final ImageService imageService;


	@GetMapping("/{imageName}")
	public ResponseEntity<byte[]> getImage(
			@PathVariable String imageName,
			@RequestParam(required = false, value = "v") long version
	) {
		var image = imageService.loadImage(imageName);
		var headers = new HttpHeaders();
		headers.setContentType(image.type());
		return new ResponseEntity<>(image.data(), headers, HttpStatus.OK);
	}

}
