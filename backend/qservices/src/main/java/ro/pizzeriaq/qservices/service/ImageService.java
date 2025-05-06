package ro.pizzeriaq.qservices.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.Image;
import ro.pizzeriaq.qservices.exceptions.ImageException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class ImageService {

	private final String folderPath;

	public ImageService(@Value("${images.folder-path}") String folderPath) {
		this.folderPath = folderPath;
	}


	public Image loadImage(String imageName) {
		var imageType = switch (getImageFileFormat(imageName)) {
			case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
			case "png" -> MediaType.IMAGE_PNG;
			default -> throw new ImageException("Unsupported image format: " + imageName);
		};
		try {
			var bytes = Files.readAllBytes(Paths.get(folderPath, imageName));
			return new Image(imageType, bytes);
		} catch (IOException e) {
			throw new ImageException("Error loading image: " + imageName, e);
		}
	}


	public long getImageTimestamp(String imageName) {
		try {
			return Files.getLastModifiedTime(Paths.get(folderPath, imageName)).toMillis();
		} catch (IOException e) {
			throw new ImageException("Error getting image timestamp: " + imageName, e);
		}
	}


	private String getImageFileFormat(String imageName) {
		return imageName.substring(imageName.lastIndexOf(".") + 1);
	}


	public boolean imageExists(String imageName) {
		return Files.exists(Paths.get(folderPath, imageName));
	}
}
