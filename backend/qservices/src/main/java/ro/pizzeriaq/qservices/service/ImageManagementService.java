package ro.pizzeriaq.qservices.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@Service
public class ImageManagementService {

	private final String folderPath = "static/images/";


	private byte[] readImage(String imageName) throws IOException {
		return Files.readAllBytes(new ClassPathResource(folderPath + imageName).getFile().toPath());
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
			return null;
		}
	}

	public boolean imageExists(String imageName) {
		try {
			return Files.exists(new ClassPathResource(folderPath + imageName).getFile().toPath());
		} catch (IOException e) {
			return false;
		}
	}
}
