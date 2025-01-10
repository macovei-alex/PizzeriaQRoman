package ro.pizzeriaq.qservices.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@Service
public class ImageManager {

	private final String folderPath = "static/images/";


	private byte[] readImage(String imageName) throws IOException {
		return Files.readAllBytes(new ClassPathResource(folderPath + imageName).getFile().toPath());
	}


	private String encodeImageData(byte[] imageBytes) {
		return Base64.getEncoder().encodeToString(imageBytes);
	}


	public String readImageBase64(String imageName) {
		try {
			byte[] image = readImage(imageName);
			return encodeImageData(image);
		} catch (IOException e) {
			return "";
		}
	}
}
