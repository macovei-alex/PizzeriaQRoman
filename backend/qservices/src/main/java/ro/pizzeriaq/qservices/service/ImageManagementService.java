package ro.pizzeriaq.qservices.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Service
public class ImageManagementService {

	private static final Logger logger = LoggerFactory.getLogger(ImageManagementService.class);

	private final String folderPath = "static/images/";


	private byte[] readImage(String imageName) throws IOException {
		try (InputStream inputStream = new ClassPathResource(folderPath + imageName).getInputStream()) {
			return inputStream.readAllBytes();
		}
	}


	private String getImageFileFormat(String imageName) {
		return imageName.substring(imageName.lastIndexOf(".") + 1);
	}


	private String getBase64Prefix(String imageName) {
		return "data:image/" + getImageFileFormat(imageName) + ";base64,";
	}


	private String encodeImageData(byte[] imageBytes) {
		return Base64.getEncoder().encodeToString(imageBytes);
	}


	public String readImageBase64(String imageName) {
		try {
			byte[] image = readImage(imageName);
			return getBase64Prefix(imageName) + encodeImageData(image);
		} catch (IOException e) {
			logger.error("Image not found: {}", imageName);
			return null;
		}
	}

	public boolean imageExists(String imageName) {
		return new ClassPathResource(folderPath + imageName).exists();
	}
}
