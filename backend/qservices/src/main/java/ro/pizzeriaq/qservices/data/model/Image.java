package ro.pizzeriaq.qservices.data.model;

import org.springframework.http.MediaType;

public record Image(MediaType type, byte[] data) {
}
